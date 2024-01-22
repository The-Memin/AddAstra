

jQuery(function ($) {
	

	function crearCometas() {
		const cometaContainer = document.querySelector('.galaxy');

		for (let i = 0; i < 3; i++) {
			setTimeout(() => {
				const cometa = document.createElement('div');// Crear un elemento div para representar el cometa / cometa
				cometa.className = 'cometa';
				cometa.style.left = Math.random() * 100 + '%';
				cometa.style.top = Math.random() * 100 + '%';

				cometaContainer.appendChild(cometa);
			}, Math.random() * 5000);
		}
	}

	crearCometas()

});