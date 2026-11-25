const PACKAGES = [
            { id: 1, diamonds: "110", price: "3.00", label: "110 diamantes", art: 0 },
            { id: 2, diamonds: "341", price: "9.00", label: "341 diamantes", art: 1 },
            { id: 3, diamonds: "572", price: "14.50", label: "572 diamantes", art: 2 },
            { id: 4, diamonds: "1,166", price: "29.00", label: "1,166 diamantes", art: 3 },
            { id: 5, diamonds: "2,398", price: "53.00", label: "2,398 diamantes", art: 4 },
            { id: 6, diamonds: "6,160", price: "128.00", label: "6,160 diamantes", art: 5 },
            { id: 7, diamonds: "Pase Booyah", price: "4.00", label: "Pase Booyah", art: 6, isPass: true, passImage: "assets/pase-booyah.png" }
        ];

        const PACKAGE_ART = [
            "assets/paquete-diamantes-01.jpg",
            "assets/paquete-diamantes-02.jpg",
            "assets/paquete-diamantes-03.jpg",
            "assets/paquete-diamantes-04.jpg",
            "assets/paquete-diamantes-05.jpg",
            "assets/paquete-diamantes-06.jpg"
        ];

        const WHATSAPP_NUMBER = "51927181834";

        let currentOrder = {
            package: null,
            playerId: "",
            clientName: "",
            refCode: "",
            couponCode: "",
            discountPercent: 0
        };

        function precioOriginal() {
            return currentOrder.package ? Number(currentOrder.package.price) : 0;
        }

        function precioFinal() {
            const original = precioOriginal();
            return Math.round((original * (1 - (currentOrder.discountPercent || 0) / 100)) * 100) / 100;
        }

        function formatoSoles(amount) {
            return "S/ " + Number(amount).toFixed(2);
        }

        function actualizarPrecioConDescuento() {
            if (!currentOrder.package) return;
            const original = precioOriginal();
            const final = precioFinal();
            document.getElementById("pkgPrice").value = formatoSoles(final);
            const preview = document.getElementById("discountPreview");
            if (currentOrder.discountPercent > 0) {
                preview.style.display = "block";
                document.getElementById("discountTag").textContent =
                    currentOrder.couponCode + " · " + currentOrder.discountPercent + "% DE DESCUENTO";
                document.getElementById("originalPrice").textContent = formatoSoles(original);
                document.getElementById("discountedPrice").textContent = formatoSoles(final);
                document.getElementById("savedAmount").textContent =
                    "¡Ahorras " + formatoSoles(original - final) + "!";
            } else {
                preview.style.display = "none";
            }
            document.getElementById("sumPrice").textContent = formatoSoles(final);
            const sumCoupon = document.getElementById("sumCoupon");
            if (sumCoupon) {
                sumCoupon.textContent = currentOrder.discountPercent > 0
                    ? currentOrder.couponCode + " (" + currentOrder.discountPercent + "%)"
                    : "Sin cupón";
            }
            const sumOriginal = document.getElementById("sumOriginal");
            if (sumOriginal) {
                sumOriginal.textContent = currentOrder.discountPercent > 0 ? formatoSoles(original) : "—";
            }
        }

        function aplicarCupon() {
            if (!currentOrder.package) {
                document.getElementById("couponMessage").textContent = "Primero selecciona un paquete.";
                return;
            }
            const input = document.getElementById("couponCode");
            const code = input.value.trim().toUpperCase();
            const message = document.getElementById("couponMessage");
            const coupon = (typeof CUPONES !== "undefined") ? CUPONES[code] : null;

            currentOrder.couponCode = "";
            currentOrder.discountPercent = 0;

            if (!code) {
                message.textContent = "Escribe un código para aplicar el descuento.";
                message.className = "coupon-message coupon-error";
                actualizarPrecioConDescuento();
                actualizarResumen();
                return;
            }
            if (!coupon || !coupon.activo) {
                message.textContent = "Código no válido o actualmente desactivado.";
                message.className = "coupon-message coupon-error";
                actualizarPrecioConDescuento();
                actualizarResumen();
                return;
            }

            currentOrder.couponCode = code;
            currentOrder.discountPercent = Number(coupon.descuento) || 0;
            message.textContent = "¡Código " + code + " aplicado! Tienes " + currentOrder.discountPercent + "% de descuento.";
            message.className = "coupon-message coupon-success";
            actualizarPrecioConDescuento();
            actualizarResumen();
        }

        function renderPackages() {
            const grid = document.getElementById("packagesGrid");
            grid.innerHTML = "";
            PACKAGES.forEach(pkg => {
                const card = document.createElement("div");
                card.className = "package-card";
                card.innerHTML = `
                    <div class="package-art ${pkg.isPass ? "pass-art" : ""}" role="img" aria-label="${pkg.label}" style="${pkg.isPass ? `background-image: url('${pkg.passImage}'); background-size: contain; background-position: center; background-repeat: no-repeat;` : `background-image: url('${PACKAGE_ART[pkg.art] || ""}')`}"></div>
                    <div class="package-amount">${pkg.diamonds}</div>
                    <div class="package-label">${pkg.isPass ? "Pase de temporada" : "diamantes"}</div>
                    <div class="package-price">S/ ${pkg.price}</div>
                    <button class="btn-buy" onclick="seleccionarPaquete(${pkg.id})">Comprar</button>
                `;
                grid.appendChild(card);
            });
        }

        function seleccionarPaquete(id) {
            const pkg = PACKAGES.find(p => p.id === id);
            if (!pkg) return;

            currentOrder.package = pkg;
            currentOrder.refCode = generarCodigoReferencia();
            currentOrder.couponCode = "";
            currentOrder.discountPercent = 0;

            document.getElementById("packagesSection").classList.add("hidden");
            document.getElementById("orderSection").classList.add("active");
            document.getElementById("yapeBlock").style.display = "none";

            document.getElementById("pkgName").value = pkg.label;
            document.getElementById("pkgPrice").value = "S/ " + pkg.price;
            document.getElementById("refCode").value = currentOrder.refCode;
            document.getElementById("playerId").value = "";
            document.getElementById("clientName").value = "";
            document.getElementById("couponCode").value = "";
            document.getElementById("couponMessage").textContent = "";
            document.getElementById("couponMessage").className = "coupon-message";
            document.getElementById("discountPreview").style.display = "none";
            document.getElementById("errorPlayerId").classList.remove("show");
            actualizarPrecioConDescuento();

            actualizarResumen();
            document.getElementById("orderSection").scrollIntoView({ behavior: "smooth" });
        }

        function generarCodigoReferencia() {
            const fecha = new Date();
            const y = fecha.getFullYear().toString().slice(-2);
            const m = String(fecha.getMonth() + 1).padStart(2, "0");
            const d = String(fecha.getDate()).padStart(2, "0");
            const h = String(fecha.getHours()).padStart(2, "0");
            const min = String(fecha.getMinutes()).padStart(2, "0");
            const rand = Math.floor(Math.random() * 9000 + 1000);
            return `FF${y}${m}${d}${h}${min}-${rand}`;
        }

        function actualizarResumen() {
            if (!currentOrder.package) return;
            document.getElementById("sumPkg").textContent = currentOrder.package.label;
            document.getElementById("sumPrice").textContent = formatoSoles(precioFinal());
            const sumCoupon = document.getElementById("sumCoupon");
            if (sumCoupon) sumCoupon.textContent = currentOrder.discountPercent > 0 ? currentOrder.couponCode + " (" + currentOrder.discountPercent + "%)" : "Sin cupón";
            const sumOriginal = document.getElementById("sumOriginal");
            if (sumOriginal) sumOriginal.textContent = currentOrder.discountPercent > 0 ? formatoSoles(precioOriginal()) : "—";
            document.getElementById("sumId").textContent = currentOrder.playerId || "—";
            const pagePlayerId = document.getElementById("pagePlayerId");
            if (pagePlayerId) pagePlayerId.textContent = currentOrder.playerId || "—";
            document.getElementById("sumName").textContent = currentOrder.clientName || "No proporcionado";
            document.getElementById("sumRef").textContent = currentOrder.refCode;
        }

        function confirmarDatos() {
            const playerId = document.getElementById("playerId").value.trim();
            const clientName = document.getElementById("clientName").value.trim();

            if (!playerId) {
                document.getElementById("errorPlayerId").classList.add("show");
                document.getElementById("playerId").focus();
                return;
            }
            document.getElementById("errorPlayerId").classList.remove("show");

            currentOrder.playerId = playerId;
            currentOrder.clientName = clientName;
            actualizarResumen();

            document.getElementById("yapeAmount").textContent = formatoSoles(precioFinal());
            document.getElementById("yapeBlock").style.display = "block";
            document.getElementById("yapeBlock").scrollIntoView({ behavior: "smooth" });
        }

        function limpiarFormulario() {
            document.getElementById("playerId").value = "";
            document.getElementById("clientName").value = "";
            document.getElementById("couponCode").value = "";
            document.getElementById("couponMessage").textContent = "";
            document.getElementById("couponMessage").className = "coupon-message";
            document.getElementById("discountPreview").style.display = "none";
            document.getElementById("errorPlayerId").classList.remove("show");
            currentOrder.playerId = "";
            currentOrder.clientName = "";
            currentOrder.couponCode = "";
            currentOrder.discountPercent = 0;
            actualizarPrecioConDescuento();
            actualizarResumen();
            document.getElementById("yapeBlock").style.display = "none";
        }

        function volverAPaquetes() {
            document.getElementById("orderSection").classList.remove("active");
            document.getElementById("packagesSection").classList.remove("hidden");
            document.getElementById("yapeBlock").style.display = "none";
            currentOrder = { package: null, playerId: "", clientName: "", refCode: "", couponCode: "", discountPercent: 0 };
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        function validarPedidoParaWhatsApp(e) {
            if (e) e.preventDefault();
            if (!currentOrder.package || !currentOrder.playerId) {
                alert("Completa primero los datos del pedido.");
                return false;
            }
            return true;
        }

        // WhatsApp recibe únicamente los dígitos del ID, sin subtítulos ni texto.
        function enviarIdWhatsApp(e) {
            if (!validarPedidoParaWhatsApp(e)) return;
            const soloId = String(currentOrder.playerId).replace(/\s+/g, "");
            const pagePlayerId = document.getElementById("pagePlayerId");
            if (pagePlayerId) pagePlayerId.textContent = soloId;
            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(soloId)}`;
            window.open(url, "_blank");
        }

        // Abre WhatsApp para que el cliente adjunte la captura del pago.
        function verificarPagoWhatsApp(e) {
            if (!validarPedidoParaWhatsApp(e)) return;
            const mensaje = `Hola, deseo verificar el pago de mi pedido ${currentOrder.refCode}. Adjuntaré aquí mi comprobante de Yape.`;
            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, "_blank");
        }

        // Envía los datos del paquete y el importe; el ID se envía por su botón.
        function enviarPedidoWhatsApp(e) {
            if (!validarPedidoParaWhatsApp(e)) return;

            let mensaje = `*NUEVO PEDIDO DE DIAMANTES*\\n\\n`;
            mensaje += `📋 *Código de referencia:* ${currentOrder.refCode}\\n`;
            mensaje += `💎 *Paquete:* ${currentOrder.package.label}\\n`;
            mensaje += `💰 *Precio original:* ${formatoSoles(precioOriginal())}\\n`;
            if (currentOrder.discountPercent > 0) {
                mensaje += `🎟️ *Cupón:* ${currentOrder.couponCode} (${currentOrder.discountPercent}% de descuento)\\n`;
                mensaje += `💸 *Descuento:* ${formatoSoles(precioOriginal() - precioFinal())}\\n`;
            }
            mensaje += `✅ *Total a pagar:* ${formatoSoles(precioFinal())}`;
            if (currentOrder.clientName) {
                mensaje += `\\n👤 *Nombre:* ${currentOrder.clientName}`;
            }

            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, "_blank");
        }


        // Fondos Free Fire: una imagen entra mientras la anterior se desvanece.
        const FREE_FIRE_BACKGROUNDS = ['assets/fondos/fondo-free-fire-01.jpg', 'assets/fondos/fondo-free-fire-02.jpg', 'assets/fondos/fondo-free-fire-03.jpg', 'assets/fondos/fondo-free-fire-04.jpg', 'assets/fondos/fondo-free-fire-05.jpg', 'assets/fondos/fondo-free-fire-06.jpg', 'assets/fondos/fondo-free-fire-07.jpg', 'assets/fondos/fondo-free-fire-08.jpg'];
        function iniciarFondosRotativos() {
            document.querySelectorAll(".ambient-gallery").forEach((gallery, galleryIndex) => {
                const layers = FREE_FIRE_BACKGROUNDS.map((src, index) => {
                    const img = document.createElement("img");
                    img.src = src;
                    img.alt = "";
                    img.loading = "eager";
                    if (index === galleryIndex % FREE_FIRE_BACKGROUNDS.length) img.classList.add("is-visible");
                    gallery.appendChild(img);
                    return img;
                });
                let active = galleryIndex % layers.length;
                window.setInterval(() => {
                    layers[active].classList.remove("is-visible");
                    active = (active + 1) % layers.length;
                    layers[active].classList.add("is-visible");
                }, 6500);
            });
        }

        document.addEventListener("DOMContentLoaded", function() {
            iniciarFondosRotativos();
            renderPackages();

            document.getElementById("playerId").addEventListener("input", function() {
                currentOrder.playerId = this.value.trim();
                actualizarResumen();
            });
            document.getElementById("clientName").addEventListener("input", function() {
                currentOrder.clientName = this.value.trim();
                actualizarResumen();
            });
            document.getElementById("couponCode").addEventListener("input", function() {
                this.value = this.value.toUpperCase();
            });
            document.getElementById("couponCode").addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    aplicarCupon();
                }
            });
        });
