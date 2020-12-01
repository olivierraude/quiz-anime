

export class AnimMot {

	/**
	 * Classe permettant de créer et d'animer des éléments textuels
	 * @param {Number} posX - position du mot sur l'axe des X
	 * @param {Number} posY - position du mot sur l'axe des Y
	 * @param {String} mot  - chaîne indiquant le mot à animer
	 * @param {HTMLElement} conteneurParent -  balise HTML pour afficher les mots animés
	 */

	constructor(posX, posY, mot, conteneurParent) {
		//Récupérer les valeurs passées en paramètre			
		this.posX = posX;
		this.posY = posY;
		this.mot = mot;
		this.conteneurParent = conteneurParent;

		//Autres propriétés du mot animé
		this.pourcentageOpacite = 1;
		this.pourcentageEchelle = 1;

		//Créer le mot
		this.creerMot();
	}

	/**
	 * Méthode pour créer chaque instance de la classe Mot et pour débuter leur animation
	 */
	creerMot () {
		//Créer une balise <div> pour le mot et lui attribuer des styles
		this.elHTML = document.createElement('div');
		this.elHTML.style.position = "absolute";
		this.elHTML.style.left = this.posX + "px";
		this.elHTML.style.top = this.posY + "px";
		
		
		//Mettre le point de transformation au centre
		this.elHTML.style.transformOrigin = "50% 50%";

		//Afficher le mot transféré et mettre l'élément HTML dans son conteneur parent
		this.elHTML.innerHTML = this.mot;
		this.conteneurParent.appendChild(this.elHTML);

		//Partir la première RequestAnimationFrame
		window.requestAnimationFrame(()=> {this.animerMot()});
	}


	/**
	 * Méthode pour animer le mot et le détruire à la fin de son animation
	 */
	animerMot (tempsActuel) {
		//console.log("AnimMot", this);
		//Décrémenter le pourcentage d'animation pour l'opacité
		this.pourcentageOpacite -= 0.03;
		//Incrémenter le pourcentage d'animation pour l'échelle
		this.pourcentageEchelle += 0.03;

		//Si le pourcentage de l'opacité est > 0, on anime le mot et on repart une nouvelle requête d'animation
		//Sinon, on enlève l'élément HTML de l'affichage et +

		if (this.pourcentageOpacite > 0) {
			//Animer l'échelle et l'opacité du mot (i.e. de l'élément HTML)
			this.elHTML.style.opacity = this.pourcentageOpacite + "";
			this.elHTML.style.transform = `scale(${this.pourcentageEchelle})`;

			//Prochaine requête d'animation
			this.requeteID = window.requestAnimationFrame(()=> {this.animerMot()});
			
		} else {

			//Enlever l'élément HTML de l'affichage
			this.conteneurParent.removeChild(this.elHTML);
			
			//Détruire les références
			this.elHTML = null;
			this.conteneurParent = null;

		}
	}
} //Fin animMot