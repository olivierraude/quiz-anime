import {
	Fenetre
} from './Fenetre.mjs';
import {
	AnimMot
} from './AnimMot.mjs';
import {quiz} from './quiz.mjs';

	//letiables de l'application
	//Objet littéral pour les questions du quiz
	//letiables de l'application
	//Objet littéral pour les questions du quiz
	

	let elmQuiz, //La question de Quiz en cours
		elmFooter,
		noQuestionEnCours, //no de la question en cours
		laQuestion, //La question à afficher
		lesChoixDeReponses, //Les choix de réponses
		etatQuiz, //Indications sur l'évolution du Quiz
		boutonSuivant, //Bouton pour afficher les questions suivantes
		score, //Le score du jeu
		elmBody,
		leTitre,
		meilleurScore; //Le meilleur score du joueur...

		// On récupère les balises où seront affichées les infos ou autres

		//console.log(lesChoixDeReponses.tagName)
		elmFooter = document.querySelector('footer')
		elmBody = document.querySelector('body')
		//elmQuiz = document.querySelector(".quiz");
		etatQuiz = document.querySelector("footer > p");
		boutonSuivant = document.querySelector("footer > div");
		leTitre = document.querySelector(".titre");

		//On vérifie s'il y a un meileur score déjà enregistré
		meilleurScore = localStorage.getItem("scoreCalcul") === null ? 0 : localStorage.getItem("scoreCalcul");
		
		//On initialise les valeurs du quiz
		animTitre();

	function animTitre(evt) {
		//On anime le titre
		let temps = 3
				
		leTitre.style.animation = `animIntro ${temps}s`;
		temps = Math.floor(Math.random() * 3) + .5
		leTitre.addEventListener('animationend',  () => initialiserQuiz())
	};

	function initialiserQuiz(evt) {
		//Initialiser les letiables
		noQuestionEnCours = 0;
		score = 0;
		localStorage.clear();
		
		//On affiche la première question
		afficherProchaineQuestion();
	}; // initialiserQuiz

   function creerElementDom(balise,classCss, parent, message)
   {
	   let elmDom = document.createElement(balise)
	   if (classCss != '') elmDom.classList.add(classCss)
	   parent.appendChild(elmDom)
	   elmDom.innerHTML = message;
	   return elmDom

   }

   function  sortirLaQuestionCourante(evt)
   {
	    /* si le questionnaire n'est pas terminé */
				if (noQuestionEnCours < quiz.listeQuestion.length) {
					/* on anime la sortie de la question */
						elmQuiz.classList.add('animQuiz2')
					/* Quand l'animation est teminé on affiche la prochaine question */	
						elmQuiz.addEventListener('animationend',  () => afficherProchaineQuestion())
				   }
				else {
			finJeu();
			}
		//On désactive le bouton suivant
		gererBoutonSuivant(false, 0.3);
	}
	
	function detruireLaQuestionPrecedente()
	{
		/* On détruit les choix de réponses précédent */
		while (lesChoixDeReponses && lesChoixDeReponses.firstChild) {
			lesChoixDeReponses.removeChild(lesChoixDeReponses.firstChild)
		}
		while (elmQuiz && elmQuiz.firstChild) {
			elmQuiz.removeChild(elmQuiz.firstChild)
		}
		if (elmQuiz) {
			elmBody.removeChild(elmQuiz)
		}
	}


	function afficherProchaineQuestion(evt) {
			/* On détruit la question précédente si elle existe */
			detruireLaQuestionPrecedente()
			/* On crée dynamiquement la nouvelle question */
			elmQuiz = document.createElement('section')
			/* La question doit être inséré dans le body */
			elmBody.insertBefore(elmQuiz,elmFooter)
			/* on ajoute une animation d'entrée pour la question */
			elmQuiz.classList.add('quiz', 'animQuiz1')
			/* On crée le titre de la question */
			laQuestion = creerElementDom('div', '', elmQuiz, quiz.listeQuestion[noQuestionEnCours].probleme) 
			laQuestion.id='titreQuestion'
			/* On anime le titre de la question */
			laQuestion.classList.add('animTitre')
			/* On crée le conteneur des réponses */
			lesChoixDeReponses = creerElementDom('div', '', elmQuiz,'')
			lesChoixDeReponses.id = 'lesChoix'
			//On affiche les choix de réponses
			//Le nombre de choix de réponses peut letier d'une question à l'autre
			let nbReponse = quiz.listeQuestion[noQuestionEnCours].choix.length
			for (let i = 0; i < nbReponse; i++) {
				/* Création de chacune des réponses */
				let uneReponse = creerElementDom('div',
											 'choix', 
											 lesChoixDeReponses, 
											 quiz.listeQuestion[noQuestionEnCours].choix[i])
			//	Temps  pour la durée de l'animation d'entrée de la réponse */
			let temps = 1
			// Temps du délais de l'animation d'entrée d'un réponse
			let tempsDelai = i * .5
			uneReponse.style.animation = `animEntreReponse ${temps}s ${tempsDelai}s both`;
			temps = Math.floor(Math.random() * 3) + .5
			// Quand l'animation d'entrée est terminé on commence une nouvelle animation
			uneReponse.addEventListener('animationend', () => animUneReponse(uneReponse,temps,i))
			//uneReponse.style.animation = 'animReponse ' + temps + 's ' + (i * .5) + 's infinite alternate')

			}
	}; // afficherProchaineQuestion

	function animUneReponse(uneReponse,temps,i){
		/* Deuxime animation sur une réponse */
		uneReponse.style.animation = `animReponse ${temps}s ${i * .5}s`;
		
		/* on enregistre l'indice de la réponse dans un dataset de la réponse */ 
		uneReponse.dataset.id = i
		//On met un écouteur pour choisir la réponse
		uneReponse.addEventListener("mousedown", choisirReponse, false);
	}

	function choisirReponse(evt) {
		//On enlève les écouteurs sur les boutons pour enregistrer la réponse
		let nbReponse = quiz.listeQuestion[noQuestionEnCours].choix.length
		for(let choix of lesChoixDeReponses.childNodes)
		{
			choix.removeEventListener("mousedown", choisirReponse, false);
		}


		if (parseInt(evt.target.dataset.id) === quiz.listeQuestion[noQuestionEnCours].bonneReponse) {
			//On incrémente le score
			score++;
			//On affiche un message en haut du bouton cliqué
			afficherMessage(evt.target, quiz.commentaires.bonneReponse);
		} else {
			//On affiche un message en haut du bouton cliqué
			afficherMessage(evt.target, quiz.commentaires.mauvaiseReponse);
		}
		
		noQuestionEnCours++;
		//On affiche le score et on ré-active le bouton suivant
		etatQuiz.innerHTML = ("Votre score: " + score + "! Question suivante.");
		gererBoutonSuivant(true, 1);



	}; // choisirReponse


	function afficherMessage(bouton, message) {
		console.log("afficherMessage", bouton, message);

		//On affiche le message au dessus du bouton avec la même fonte que la section
		let elmFooter = document.querySelector("footer")

		let posX = bouton.offsetRight;
		let posY = bouton.offsetHeight * 2;

		//function AnimMot(posX, posY, fonte, mot, conteneurParent ){
		let unMessage = new AnimMot(posX, posY,message, elmFooter);
	}


	function finJeu() {
		//On désactive le bouton suivant
		gererBoutonSuivant(false, 0.3);

		//Enregistrement du meilleur score
		meilleurScore = Math.max(meilleurScore, score);
		localStorage.setItem("scoreCalcul", meilleurScore);

		//On affiche une fenêtre pour indiquer que le jeu est complété
		afficherFenetre();
	}

	function afficherFenetre() {
		let laPage = document.querySelector("body");
		let largeur = laPage.offsetWidth,
			hauteur = laPage.offsetHeight,
			texte = "Le quiz est terminé!";
	
		//Texte additionnel...
		texte += "<br><br>Votre score est de " + score + "/" + quiz.listeQuestion.length;
		texte += "<br>Votre meilleur score est de " + meilleurScore + "/" + quiz.listeQuestion.length + ".";		
		texte += "<br><br>Fermer la fenêtre pour rejouer!";

		//function Fenetre(posX, posY, largeur, hauteur, classeCSS, texte, action, conteneurParent){
		let uneFenetre = new Fenetre(0, 0, largeur, hauteur, "fenetre", texte, laPage, rejouer);
		
	} // Fin afficherFenetre

	function gererBoutonSuivant(actif, transparence) {
		//console.log("gererBoutonSuivant", actif, transparence);

		if (actif == true) {

			boutonSuivant.addEventListener("mousedown", sortirLaQuestionCourante, false);

		} else {
			boutonSuivant.removeEventListener("mousedown", sortirLaQuestionCourante, false);
		}

		boutonSuivant.style.opacity = transparence + "";
	}

	function rejouer() {
		//On réinitialise la question en cours
		initialiserQuiz();
		//On change le message en bas de page pour l'état du jeu
		etatQuiz.innerHTML = "Etes-vous un capitaine?"
	}

