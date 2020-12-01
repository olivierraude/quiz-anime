
export class Fenetre {
	/**
	 * Classe permettant de créer et d'afficher une fenêtre
	 * et, d'appeler une fonction de l'application passée en paramètre
	 * @param {Number} posX - position du mot sur l'axe des X
	 * @param {Number} posY - position du mot sur l'axe des Y
	 * @param {Number} largeur - largeur de la fenêtre
	 * @param {Number} hauteur - hauteur de la fenêtre
	 * @param {String} classeCSS  - classe CSS pour la mise en forme de la fenêtre
	 * @param {String} texte  - texte à afficher dans la fenêtre
	 * @param {HTMLElement} conteneurParent -  balise HTML pour afficher les mots animés
	 * @param {Function} fonction  - fonction référencée à appeler sur un mousedown
	 */

	constructor(posX, posY, largeur, hauteur, classeCSS, texte, conteneurParent, fonction) {
		//Récupérer les valeurs passées en paramètre			
		this.posX = posX;
		this.posY = posY;
		this.largeur = largeur;
		this.hauteur = hauteur;
		this.classeCSS = classeCSS;
		this.texte = texte;
		this.conteneurParent = conteneurParent;
		this.fonction = fonction;

		//Autre propriété de la fenêtre
		this.pourcentageEchelle = 0;

		//Créer la fenêtre
		this.creerFenetre();
	}

	/**
	 * Méthode pour créer et afficher les instances de la classe Fenetre
	 */
	creerFenetre() {
		//Créer une balise <div>
		this.elHTML = document.createElement('div');
		//Appliquer les éléments de style
		this.elHTML.style.width = this.largeur + "px";
		this.elHTML.style.height = this.hauteur + "px";
		this.elHTML.style.left = this.posX + "px";
		this.elHTML.style.top = this.posY + "px";
		this.elHTML.classList.add(this.classeCSS);
		
		//Mettre un bouton dans l'élément HTML en créant simplement une division
		this.leBouton = document.createElement('div');
		this.leBouton.innerHTML = "X";
		this.elHTML.appendChild(this.leBouton);
		
		//Mettre le texte dans une seconde division
		let leTexte = document.createElement('div');
		leTexte.innerHTML = this.texte;
		this.elHTML.appendChild(leTexte);

		//Au départ on place la fenêtre en bas de l'écran
		this.posY_temp = this.hauteur;
		this.elHTML.style.bottom = this.posY_temp + "px";

		//Mettre la fenêtre dans son conteneur parent		
		this.conteneurParent.appendChild(this.elHTML);

		//Mettre un écouteur sur le bouton pour fermer la fenêtre et appeler la fonction passée en paramètre
		this.leBouton.addEventListener("mousedown", (evt) => this.fermerFenetre(evt), false);

		//Partir la première requête d'animation
		window.requestAnimationFrame(() => this.animerFenetre());
	}


	/**
	 * Méthode pour faire descendre la fenêtre au moment de son affichage
	 */
	animerFenetre() {
		//On fait descendre la fenêtre tant qu'elle n'a pas atteint sa position finale

		if (this.posY_temp > this.posY) {
			//Descendre la fenêtre
			this.posY_temp -= 8;
			this.elHTML.style.top = this.posY_temp + "px";

			//Prochaine requête d'animation
			window.requestAnimationFrame(() => this.animerFenetre());
		}
	}
	

	fermerFenetre(evt) {

		//Enlever l'écouteur sur l'élément HTML
		this.elHTML.removeEventListener("mousedown", (evt) => this.fermerFenetre(evt), false);

		//Enlever la fenetre
		this.conteneurParent.removeChild(this.elHTML);

		//Appeler la fonction passée en paramètre
		this.fonction();
		
		//Arrêter la propagation de l'événement???
		evt.stopPropagation();

		//Enlever les références
		this.elHTML = null;
		this.conteneurParent = null;
		this.fonction = null;
		this.leBouton = null;

	}

} //Fin classe Fenetre