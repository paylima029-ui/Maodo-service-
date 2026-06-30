import { db, formationsTable, modulesTable, lessonsTable, quizzesTable, quizOptionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const SLUG = "intelligence-artificielle";

function lesson(
  title: string,
  theory: string,
  quizzes: Array<{ question: string; options: Array<{ text: string; correct: boolean }> }> = []
) {
  return { title, theory, quizzes };
}

const FORMATION = {
  slug: SLUG,
  title: "Maîtriser l'Intelligence Artificielle : du Débutant au Pro",
  description: "Formation complète et pratique sur l'IA : outils, prompt engineering, applications concrètes pour étudiants, entrepreneurs et professionnels. Plus de 100 leçons pour transformer votre façon de travailler et d'apprendre.",
  category: "ia",
  modules: [

    /* ══════════════════════════════════════════
       MODULE 1 : Introduction à l'IA
    ══════════════════════════════════════════ */
    {
      title: "Module 1 : Introduction à l'Intelligence Artificielle",
      lessons: [

        lesson(
          "Qu'est-ce que l'Intelligence Artificielle ?",
          `## 🎯 Introduction

L'Intelligence Artificielle (IA) est l'une des technologies les plus transformatrices de notre époque. Mais de quoi s'agit-il exactement ? Dans cette leçon, nous allons démystifier ce concept de manière simple et concrète.

## 📚 Ce que vous allez apprendre
- La définition exacte de l'IA
- La différence entre IA, machine learning et deep learning
- Pourquoi l'IA est importante aujourd'hui

## 🔍 Explication détaillée

**L'Intelligence Artificielle** est la capacité d'un système informatique à simuler des fonctions cognitives humaines comme l'apprentissage, le raisonnement et la résolution de problèmes.

Imaginez un enfant qui apprend à reconnaître un chien : on lui montre des milliers d'images de chiens jusqu'à ce qu'il puisse identifier n'importe quel chien. L'IA fonctionne de la même manière, mais avec des données et des algorithmes.

Il existe trois niveaux à comprendre :

**1. L'Intelligence Artificielle (IA)** — le concept général de machines intelligentes.

**2. Le Machine Learning (apprentissage automatique)** — une branche de l'IA où les machines apprennent à partir de données sans être explicitement programmées.

**3. Le Deep Learning (apprentissage profond)** — une sous-branche du Machine Learning qui utilise des réseaux de neurones artificiels inspirés du cerveau humain.

## 💼 Exemples concrets

- Quand Google Photos reconnaît automatiquement votre visage sur une photo → **Vision par ordinateur (IA)**
- Quand Netflix vous recommande un film → **Système de recommandation (Machine Learning)**
- Quand ChatGPT répond à vos questions → **Large Language Model (Deep Learning)**
- Quand votre téléphone comprend votre voix → **Reconnaissance vocale (IA)**

## 💡 Astuce du formateur

Ne confondez pas "IA" et "robots". L'IA peut exister dans un simple logiciel sans aucun corps physique. ChatGPT est de l'IA — il n'a pas de corps, mais il est très intelligent !

## ✏️ Exercice pratique

Listez 5 applications que vous utilisez dans votre vie quotidienne. Pour chacune, identifiez si elle utilise l'IA et comment.

**Exemple :** WhatsApp → L'IA détecte le spam, transcrit les messages vocaux et suggère des réponses rapides.

## ✅ Correction

Applications courantes qui utilisent l'IA : Facebook (reconnaissance faciale, fil d'actualité personnalisé), Google Maps (calcul d'itinéraires, prédiction du trafic), YouTube (recommandations de vidéos), Gmail (filtrage des spams), votre clavier smartphone (suggestions de mots).`,
          [
            {
              question: "Quelle est la bonne définition de l'Intelligence Artificielle ?",
              options: [
                { text: "Un robot humanoïde capable de penser comme un être humain", correct: false },
                { text: "La capacité d'un système informatique à simuler des fonctions cognitives humaines", correct: true },
                { text: "Un ordinateur très rapide qui calcule des chiffres", correct: false },
                { text: "Un logiciel qui remplace tous les emplois humains", correct: false },
              ],
            },
            {
              question: "Quelle est la relation correcte entre IA, Machine Learning et Deep Learning ?",
              options: [
                { text: "Ce sont trois technologies complètement différentes et indépendantes", correct: false },
                { text: "Le Deep Learning contient le Machine Learning qui contient l'IA", correct: false },
                { text: "L'IA contient le Machine Learning qui contient le Deep Learning", correct: true },
                { text: "L'IA et le Machine Learning sont identiques", correct: false },
              ],
            },
            {
              question: "Lequel de ces exemples utilise le Deep Learning ?",
              options: [
                { text: "Un tableau Excel qui fait des calculs automatiques", correct: false },
                { text: "Un thermostat qui s'ajuste selon l'heure de la journée", correct: false },
                { text: "ChatGPT qui génère des réponses complexes en langage naturel", correct: true },
                { text: "Une calculatrice qui additionne des chiffres", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "L'histoire de l'IA : des origines à aujourd'hui",
          `## 🎯 Introduction

L'histoire de l'IA est une aventure fascinante qui débute dans les années 1950. Comprendre cette histoire vous permettra de mieux appréhender où nous en sommes aujourd'hui et où nous allons.

## 📚 Ce que vous allez apprendre
- Les grandes étapes de l'évolution de l'IA
- Pourquoi l'IA a connu des "hivers" et des "printemps"
- Ce qui a rendu l'IA si puissante aujourd'hui

## 🔍 Explication détaillée

### Les années 1950 — La naissance d'une idée
En 1950, le mathématicien britannique **Alan Turing** publie son célèbre article "Computing Machinery and Intelligence" et pose la question : "Les machines peuvent-elles penser ?" Il invente le **Test de Turing** : si une machine peut convaincre un humain qu'elle est humaine dans une conversation, alors elle est considérée comme intelligente.

En 1956, lors de la conférence de Dartmouth, le terme **"Intelligence Artificielle"** est officiellement créé par John McCarthy.

### Les années 1960-1970 — Premiers espoirs
Les premiers programmes d'IA comme ELIZA (un chatbot rudimentaire) font sensation. Mais les ordinateurs de l'époque manquent de puissance de calcul.

### Les "Hivers de l'IA" (1974-1980, 1987-1993)
Faute de progrès suffisants, les financements s'effondrent. On appelle ces périodes les **"hivers de l'IA"**.

### Les années 1990-2000 — Le Machine Learning émerge
En 1997, **Deep Blue** d'IBM bat le champion du monde d'échecs Garry Kasparov. C'est un tournant historique.

### 2010 à aujourd'hui — La révolution du Deep Learning
Avec l'explosion des données (Big Data), la puissance des GPU et les nouvelles architectures de réseaux de neurones, l'IA fait des bonds gigantesques :
- **2012** : AlexNet révolutionne la vision par ordinateur
- **2016** : AlphaGo bat le champion du monde de Go
- **2022** : ChatGPT atteint 100 millions d'utilisateurs en 2 mois — record absolu !
- **2024** : Les modèles multimodaux comprennent texte, images, audio et vidéo

## 💼 Exemple concret

ChatGPT en 2022, c'est comme si un enfant qui n'a jamais appris à parler se mettait soudainement à tenir une conversation de philosophie. La progression a été explosive !

## 💡 Astuce du formateur

Retenez surtout **2022** comme l'année de la grande démocratisation de l'IA avec ChatGPT. C'est le moment où l'IA est devenue accessible à tout le monde, pas seulement aux ingénieurs.

## ✏️ Exercice pratique

Créez une frise chronologique avec au moins 5 dates clés de l'histoire de l'IA. Pour chaque date, écrivez en une phrase ce qui s'est passé et pourquoi c'est important.`,
          [
            {
              question: "Qui a créé le Test de Turing et en quelle année ?",
              options: [
                { text: "John McCarthy en 1956", correct: false },
                { text: "Alan Turing en 1950", correct: true },
                { text: "Elon Musk en 2015", correct: false },
                { text: "Bill Gates en 1980", correct: false },
              ],
            },
            {
              question: "Qu'appelle-t-on les 'hivers de l'IA' ?",
              options: [
                { text: "Des périodes où les ordinateurs tombaient en panne à cause du froid", correct: false },
                { text: "Des saisons où les chercheurs travaillaient moins", correct: false },
                { text: "Des périodes de baisse de financement et de désillusion face aux promesses non tenues de l'IA", correct: true },
                { text: "Des années où l'IA était interdite par les gouvernements", correct: false },
              ],
            },
            {
              question: "En combien de temps ChatGPT a-t-il atteint 100 millions d'utilisateurs ?",
              options: [
                { text: "En 5 ans", correct: false },
                { text: "En 1 an", correct: false },
                { text: "En 2 mois", correct: true },
                { text: "En 6 mois", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Les types d'IA : étroite, générale, superintelligente",
          `## 🎯 Introduction

Toutes les IA ne sont pas identiques. Il existe différents types d'IA selon leur niveau de capacité et leur domaine d'application. Comprendre ces distinctions vous aidera à avoir des attentes réalistes face aux outils que vous utilisez.

## 📚 Ce que vous allez apprendre
- Les 3 grands types d'IA
- Les différences entre IA faible et IA forte
- Où en est l'humanité aujourd'hui

## 🔍 Explication détaillée

### 1. L'IA Étroite (Narrow AI / Weak AI)
C'est l'IA qui existe **aujourd'hui**. Elle est très performante dans **un domaine spécifique** mais incapable de faire autre chose.

**Exemples :**
- ChatGPT : excellent pour générer du texte, mais ne peut pas conduire une voiture
- AlphaGo : imbattable au jeu de Go, mais incapable de jouer aux échecs
- Face ID de votre iPhone : reconnaît votre visage, mais ne comprend pas les conversations

### 2. L'IA Générale (Artificial General Intelligence / AGI)
C'est l'IA qui **n'existe pas encore** mais que les chercheurs cherchent à créer. Une AGI aurait les mêmes capacités cognitives qu'un être humain : elle pourrait apprendre n'importe quelle tâche, raisonner, être créative, s'adapter.

Sam Altman, le PDG d'OpenAI, pense que l'AGI pourrait arriver **dans les prochaines années**.

### 3. La Superintelligence (ASI)
Une IA qui surpasserait **de loin** l'intelligence humaine dans tous les domaines. Ce concept reste aujourd'hui **théorique** et divise les experts.

Certains (comme Elon Musk) s'inquiètent des risques. D'autres pensent que c'est loin d'être réaliste.

## 💼 Analogie pour mieux comprendre

Imaginez un très bon menuisier (IA étroite) : il fait des meubles parfaits mais ne sait pas faire la cuisine. Une AGI serait comme un être humain complet : elle pourrait tout apprendre et tout faire. La superintelligence serait comme 1000 Einstein travaillant ensemble.

## 💡 Astuce du formateur

Quand quelqu'un vous dit "l'IA va tout faire à notre place", rappelez-lui qu'aujourd'hui nous n'avons que de l'**IA Étroite**. Elle est très puissante dans son domaine, mais elle n'a pas de conscience ni de compréhension réelle du monde.

## ✏️ Exercice pratique

Pour chacun des outils suivants, identifiez s'il s'agit d'IA Étroite ou d'AGI : ChatGPT, votre GPS, un robot chirurgical, un système de recommandation Netflix. Justifiez votre réponse.

## ✅ Correction

Tous ces outils sont de l'**IA Étroite** ! ChatGPT génère du texte mais ne peut pas conduire. Le GPS calcule des itinéraires mais ne comprend pas le langage. Le robot chirurgical effectue des gestes précis mais ne diagnostique pas seul. Netflix recommande des films mais ne crée pas de contenu original. L'AGI n'existe pas encore.`,
          [
            {
              question: "Quelle IA existe réellement aujourd'hui ?",
              options: [
                { text: "La Superintelligence", correct: false },
                { text: "L'IA Générale (AGI)", correct: false },
                { text: "L'IA Étroite (Narrow AI)", correct: true },
                { text: "La Conscience Artificielle", correct: false },
              ],
            },
            {
              question: "Qu'est-ce qui caractérise une IA Étroite ?",
              options: [
                { text: "Elle peut faire tout ce qu'un humain peut faire", correct: false },
                { text: "Elle est très performante dans un domaine spécifique mais limitée ailleurs", correct: true },
                { text: "Elle surpasse les humains dans tous les domaines", correct: false },
                { text: "Elle a une conscience et des émotions", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Comment fonctionne une IA concrètement ?",
          `## 🎯 Introduction

L'IA peut sembler magique, mais elle repose sur des principes mathématiques et informatiques très précis. Dans cette leçon, nous allons comprendre simplement comment une IA apprend et génère ses réponses.

## 📚 Ce que vous allez apprendre
- Le concept d'entraînement d'un modèle IA
- Comment les données transforment une IA
- Comment ChatGPT génère ses réponses

## 🔍 Explication détaillée

### Étape 1 : La collecte de données
Une IA apprend à partir de **données massives**. ChatGPT a été entraîné sur des centaines de milliards de mots provenant d'Internet, de livres et d'articles. C'est comme si vous lisiez toute la bibliothèque mondiale avant de passer un examen.

### Étape 2 : L'entraînement
Pendant l'entraînement, l'IA analyse ces données et ajuste des millions (parfois des milliards) de **paramètres** — pensez à cela comme des boutons de réglage que l'IA ajuste pour améliorer ses prédictions.

L'objectif : **prédire le prochain mot** d'une phrase de manière cohérente et pertinente.

**Exemple :**  
"Le ciel est..." → l'IA apprend que "bleu" vient souvent après cette phrase.  
"La capitale du Sénégal est..." → l'IA apprend que "Dakar" suit logiquement.

### Étape 3 : La génération de réponses
Quand vous posez une question à ChatGPT, il ne "cherche" pas dans une base de données. Il **génère** le texte le plus probable mot par mot, en tenant compte de votre question et du contexte.

C'est pour cela qu'il peut parfois "inventer" des informations — on appelle cela des **hallucinations**.

### Les Tokens
Les LLM (Large Language Models) ne comprennent pas les mots entiers, ils travaillent avec des **tokens** — des fragments de mots. "Bonjour" peut être 1 token, "intelligence artificielle" peut être 3 tokens.

## 💼 Analogie

Imaginez que vous avez lu 1 million de livres. Si quelqu'un dit "Il était une fois...", vous compléterez instinctivement avec "...un roi". C'est exactement ce que fait ChatGPT — à une échelle beaucoup plus grande !

## 💡 Astuce du formateur

Quand ChatGPT fait une erreur ou invente une information, ce n'est pas parce qu'il "ment" — c'est parce qu'il **prédit** le texte le plus probable, qui n'est pas toujours le plus exact. Toujours vérifier les informations importantes !

## ✏️ Exercice pratique

Posez la même question à ChatGPT deux fois de suite : "Complète cette phrase : Au Sénégal, la saison des pluies..." Observez si les réponses sont identiques ou différentes, et pourquoi.`,
          [
            {
              question: "Comment ChatGPT génère-t-il ses réponses ?",
              options: [
                { text: "Il cherche dans une base de données Wikipedia", correct: false },
                { text: "Un humain tape les réponses en temps réel", correct: false },
                { text: "Il prédit le texte le plus probable mot par mot en se basant sur son entraînement", correct: true },
                { text: "Il copie des réponses d'autres sites internet", correct: false },
              ],
            },
            {
              question: "Qu'est-ce qu'une 'hallucination' dans le contexte de l'IA ?",
              options: [
                { text: "L'IA qui voit des images imaginaires", correct: false },
                { text: "L'IA qui génère des informations fausses ou inventées de manière convaincante", correct: true },
                { text: "L'IA qui refuse de répondre à une question", correct: false },
                { text: "L'IA qui tombe en panne", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "L'IA dans la vie quotidienne en Afrique",
          `## 🎯 Introduction

L'IA n'est pas réservée aux pays développés. Elle est déjà présente dans votre vie quotidienne en Afrique — souvent sans que vous le sachiez. Dans cette leçon, nous allons découvrir comment l'IA transforme le quotidien des Africains.

## 📚 Ce que vous allez apprendre
- Les usages de l'IA que vous utilisez déjà au Sénégal
- Les opportunités uniques de l'IA pour l'Afrique
- Comment l'Afrique peut bénéficier de l'IA

## 🔍 Explication détaillée

### L'IA que vous utilisez sans le savoir

**1. WhatsApp** — Transcription des messages vocaux, détection du spam, suggestions de réponses rapides.

**2. Mobile Money (Wave, Orange Money)** — Détection de fraude en temps réel. Chaque transaction est analysée par une IA pour détecter les comportements suspects.

**3. Google Maps au Sénégal** — L'IA calcule les itinéraires en tenant compte du trafic de l'heure de pointe à Dakar, des routes en travaux et des incidents.

**4. YouTube et TikTok** — L'algorithme qui vous recommande des vidéos est une IA très sophistiquée.

**5. Filtres Instagram** — La reconnaissance faciale qui applique les filtres est de l'IA.

### Opportunités uniques pour l'Afrique

**Santé** : Des IA peuvent diagnostiquer la malaria sur des images de sang avec une précision supérieure aux médecins humains. Des projets comme cette initiative existent déjà en Afrique subsaharienne.

**Agriculture** : Des IA analysent les images satellites pour prédire les récoltes, détecter les maladies des plantes et conseiller les agriculteurs en temps réel.

**Langues locales** : Des projets comme Masakhane cherchent à créer des IA qui parlent le wolof, le bambara, le swahili et d'autres langues africaines.

**Fintech** : Des IA permettent à des personnes sans compte bancaire traditionnel d'accéder au crédit via l'analyse de leur historique mobile.

## 💼 Exemple concret

En 2023, un médecin sénégalais peut utiliser une IA sur son smartphone pour analyser une radio thoracique et détecter une tuberculose en quelques secondes. Cette technologie peut sauver des vies dans les zones rurales éloignées des hôpitaux.

## 💡 Astuce du formateur

L'Afrique a un avantage unique : elle peut adopter directement les meilleures technologies sans être freinée par des systèmes anciens. Tout comme elle a sauté l'étape des téléphones fixes pour aller directement aux smartphones !

## ✏️ Exercice pratique

Pendant une journée, notez toutes les fois où vous interagissez avec une application ou un service qui pourrait utiliser l'IA. Le soir, comptez et comparez avec vos camarades.`,
          [
            {
              question: "Parmi ces services, lequel utilise l'IA pour protéger vos transactions ?",
              options: [
                { text: "Les cabines téléphoniques", correct: false },
                { text: "Les services Mobile Money comme Wave et Orange Money", correct: true },
                { text: "Les livres scolaires numériques", correct: false },
                { text: "Les panneaux publicitaires en ville", correct: false },
              ],
            },
            {
              question: "Quel est l'avantage unique de l'Afrique face à l'adoption de l'IA ?",
              options: [
                { text: "L'Afrique a les ordinateurs les plus puissants du monde", correct: false },
                { text: "Elle peut adopter directement les nouvelles technologies sans être freinée par des systèmes anciens", correct: true },
                { text: "L'IA a été inventée en Afrique", correct: false },
                { text: "L'Afrique a le plus grand nombre de chercheurs en IA", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Les métiers liés à l'IA",
          `## 🎯 Introduction

L'IA crée de nouveaux métiers tout en transformant les anciens. Comprendre ces métiers vous permettra de vous positionner stratégiquement pour votre carrière.

## 📚 Ce que vous allez apprendre
- Les métiers techniques liés à l'IA
- Les métiers non-techniques amplifiés par l'IA
- Comment vous préparer à ces opportunités

## 🔍 Explication détaillée

### Métiers techniques

**Data Scientist** — Analyse des données massives pour extraire des insights. Salaire moyen dans les grandes entreprises : 60 000 - 150 000 €/an.

**Ingénieur Machine Learning** — Développe et entraîne des modèles d'IA.

**Ingénieur LLM / Prompt Engineer** — Spécialiste dans la conception de prompts et l'intégration de modèles de langage. Nouveau métier très demandé !

**Ingénieur Data** — Construit les pipelines qui alimentent les modèles en données.

**Chercheur en IA** — Développe de nouveaux algorithmes et publie des recherches.

### Métiers non-techniques amplifiés par l'IA

**Avocat spécialisé en IA** — Droit, propriété intellectuelle et éthique de l'IA.

**Journaliste data** — Utilise l'IA pour analyser et présenter des données complexes.

**Designer UX pour produits IA** — Crée des interfaces intuitives pour les outils d'IA.

**Formateur en IA** — Forme des professionnels à l'utilisation des outils d'IA. (C'est d'ailleurs un métier très demandé en Afrique !)

**Entrepreneur IA** — Crée des services et produits intégrant l'IA pour résoudre des problèmes locaux.

### Métiers à risque et à adapter

Des métiers comme la saisie de données, la traduction basique, la rédaction de contenus répétitifs sont partiellement automatisables. La clé : **s'adapter et utiliser l'IA comme outil**, pas comme concurrent.

## 💼 Opportunité africaine

Un **consultant en IA** pour PME africaines peut facturer 50 000 à 200 000 FCFA par jour pour aider des entreprises à adopter les outils d'IA. C'est un marché encore peu exploité !

## 💡 Astuce du formateur

Le métier le plus accessible sans formation technique avancée : **Prompt Engineer / Consultant IA**. Si vous maîtrisez cette formation, vous avez les bases pour accompagner des entreprises !

## ✏️ Exercice pratique

Faites une recherche sur LinkedIn ou sur des sites d'emploi pour trouver 3 offres d'emploi qui mentionnent l'IA. Identifiez les compétences demandées. Ces compétences sont-elles accessibles ?`,
          [
            {
              question: "Qu'est-ce qu'un Prompt Engineer ?",
              options: [
                { text: "Un ingénieur qui construit des moteurs (engines) pour voitures", correct: false },
                { text: "Un spécialiste qui conçoit des instructions optimales pour les modèles d'IA", correct: true },
                { text: "Un développeur qui programme des robots", correct: false },
                { text: "Un technicien qui répare les serveurs informatiques", correct: false },
              ],
            },
            {
              question: "Quelle est la meilleure stratégie face à l'automatisation par l'IA ?",
              options: [
                { text: "Éviter totalement l'utilisation de l'IA", correct: false },
                { text: "S'adapter et utiliser l'IA comme outil pour être plus productif", correct: true },
                { text: "Attendre que les gouvernements interdisent l'IA", correct: false },
                { text: "Changer de métier pour quelque chose que l'IA ne peut pas faire", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Bilan du Module 1 et quiz final",
          `## 🎯 Introduction

Félicitations ! Vous avez terminé le premier module. Faisons le point sur tout ce que vous avez appris avant de passer aux outils d'IA.

## 📚 Récapitulatif des points clés

### ✅ Ce que vous savez maintenant

**1. La définition de l'IA**
L'IA est la capacité d'un système informatique à simuler des fonctions cognitives humaines. L'IA contient le Machine Learning qui contient le Deep Learning.

**2. L'histoire de l'IA**
- 1950 : Test de Turing par Alan Turing
- 1956 : Naissance officielle du terme "IA" à Dartmouth
- 1997 : Deep Blue bat Kasparov aux échecs
- 2022 : ChatGPT révolutionne l'accès à l'IA

**3. Les types d'IA**
- IA Étroite : existe aujourd'hui, très performante dans un domaine spécifique
- IA Générale (AGI) : n'existe pas encore, aurait les capacités d'un humain
- Superintelligence : concept théorique, surpasserait les humains dans tout

**4. Comment fonctionne une IA**
Elle apprend à partir de données massives, ajuste ses paramètres pendant l'entraînement, et génère des réponses en prédisant le texte le plus probable.

**5. L'IA en Afrique**
Elle est déjà présente (Mobile Money, WhatsApp, Google Maps) et crée des opportunités uniques (santé, agriculture, langues locales).

**6. Les métiers de l'IA**
De nouveaux métiers émergent (Data Scientist, Prompt Engineer, Consultant IA) et les métiers existants sont amplifiés par l'IA.

## 🎯 Votre progression

Vous avez maintenant les bases conceptuelles pour comprendre et utiliser l'IA de manière éclairée. Dans le module suivant, nous allons découvrir concrètement les principaux outils d'IA disponibles aujourd'hui.

## ✏️ Exercice final du module

Rédigez en 5 à 10 phrases votre vision personnelle de l'IA : Comment voyez-vous l'IA impacter votre métier, vos études ou votre quotidien dans les 5 prochaines années ? Quelles opportunités voyez-vous pour vous personnellement ?

## 💡 Conseil pour la suite

Dans le prochain module, préparez-vous à créer des comptes gratuits sur ChatGPT, Gemini et Claude. Vous aurez besoin d'une adresse email et d'un accès internet.`,
          [
            {
              question: "Qui a officiellement créé le terme 'Intelligence Artificielle' en 1956 ?",
              options: [
                { text: "Alan Turing lors du Test de Turing", correct: false },
                { text: "Bill Gates à Microsoft", correct: false },
                { text: "John McCarthy lors de la conférence de Dartmouth", correct: true },
                { text: "Sam Altman chez OpenAI", correct: false },
              ],
            },
            {
              question: "Parmi ces énoncés, lequel est FAUX concernant l'IA actuelle ?",
              options: [
                { text: "ChatGPT génère du texte en prédisant les mots les plus probables", correct: false },
                { text: "L'IA peut parfois inventer des informations fausses (hallucinations)", correct: false },
                { text: "L'IA Générale (AGI) existe déjà et est utilisée par Google", correct: true },
                { text: "L'IA étroite est très performante dans un domaine spécifique", correct: false },
              ],
            },
            {
              question: "Quel service de Mobile Money utilise l'IA pour détecter les fraudes ?",
              options: [
                { text: "Aucun, ces services n'utilisent pas l'IA", correct: false },
                { text: "Seulement les banques occidentales utilisent l'IA pour ça", correct: false },
                { text: "Des services comme Wave et Orange Money utilisent l'IA pour analyser chaque transaction", correct: true },
                { text: "L'IA est trop chère pour les services africains", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 2 : Les outils d'IA
    ══════════════════════════════════════════ */
    {
      title: "Module 2 : Les Grands Outils d'IA",
      lessons: [

        lesson(
          "ChatGPT : l'assistant IA de référence",
          `## 🎯 Introduction

ChatGPT est l'outil qui a démocratisé l'IA. Lancé en novembre 2022 par OpenAI, il a atteint 100 millions d'utilisateurs en seulement 2 mois. Dans cette leçon, nous allons explorer ses fonctionnalités, ses forces et ses limites.

## 📚 Ce que vous allez apprendre
- Les fonctionnalités clés de ChatGPT
- La différence entre les versions gratuites et payantes
- Les meilleurs cas d'usage de ChatGPT

## 🔍 Fonctionnalités principales

### ChatGPT Gratuit (GPT-3.5 puis GPT-4o mini)
- Conversation en langage naturel dans 50+ langues
- Rédaction de textes, résumés, traductions
- Réponses à des questions complexes
- Aide à la programmation
- Explication de concepts difficiles

### ChatGPT Plus (20$/mois) — GPT-4o
- Modèle beaucoup plus puissant et précis
- Analyse d'images (vous montrez une photo, il la décrit et répond à vos questions)
- Génération d'images avec DALL·E 3
- Navigation web en temps réel
- Accès aux GPTs personnalisés

### Comment accéder à ChatGPT
1. Allez sur **chat.openai.com**
2. Créez un compte gratuit avec votre email
3. Commencez à dialoguer !

**Astuce Afrique** : ChatGPT fonctionne très bien sur mobile avec une connexion internet normale. Pas besoin d'un ordinateur puissant.

## 💼 Exemples de prompts efficaces

**Pour les études :**
"Explique-moi la photosynthèse comme si j'avais 12 ans, avec un exemple concret du Sénégal."

**Pour le travail :**
"Rédige un email professionnel pour demander un stage dans une entreprise IT à Dakar."

**Pour les affaires :**
"Quels sont les 5 meilleurs business à lancer avec 500 000 FCFA au Sénégal en 2024 ?"

## 💡 Astuce du formateur

Utilisez le bouton **"Régénérer la réponse"** si la première réponse ne vous convient pas. Chaque réponse est légèrement différente. Demandez aussi des réponses plus courtes ou plus longues selon vos besoins.

## ✏️ Exercice pratique

Connectez-vous à ChatGPT et testez ces 3 prompts :
1. "Qu'est-ce que l'IA et comment peut-elle m'aider en tant qu'étudiant sénégalais ?"
2. "Rédige 5 idées de business innovants pour les jeunes entrepreneurs africains"
3. "Explique-moi le principe de la photosynthèse en wolof simplifié"

Comparez les réponses et notez ce qui vous surprend !`,
          [
            {
              question: "En combien de temps ChatGPT a-t-il atteint 100 millions d'utilisateurs ?",
              options: [
                { text: "En 5 ans", correct: false },
                { text: "En 6 mois", correct: false },
                { text: "En 2 mois", correct: true },
                { text: "En 1 an", correct: false },
              ],
            },
            {
              question: "Quelle fonctionnalité est disponible uniquement dans ChatGPT Plus ?",
              options: [
                { text: "Répondre à des questions en français", correct: false },
                { text: "Rédiger des textes", correct: false },
                { text: "Analyser des images et naviguer sur le web en temps réel", correct: true },
                { text: "Faire des calculs mathématiques", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Google Gemini : l'IA de Google",
          `## 🎯 Introduction

Google Gemini (anciennement Bard) est l'IA développée par Google DeepMind. Avec l'intégration dans tous les produits Google, c'est l'un des outils les plus accessibles et les plus puissants disponibles aujourd'hui.

## 📚 Ce que vous allez apprendre
- Les spécificités de Gemini par rapport à ChatGPT
- Comment utiliser Gemini avec vos outils Google
- Les cas d'usage où Gemini excelle

## 🔍 Fonctionnalités de Gemini

### Gemini (Gratuit)
- Accès à **gemini.google.com**
- Conversation avancée en français et 40+ langues
- Analyse d'images
- Génération d'images (en version Pro)
- **Intégration native avec Google** : Gmail, Docs, Drive, Sheets, Slides

### Gemini Advanced (payant via Google One)
- Modèle Gemini Ultra — le plus puissant de Google
- Fonctionnalités avancées d'analyse
- 1 To de stockage Google inclus

### L'avantage unique de Gemini

**Accès aux informations en temps réel** : Contrairement au ChatGPT gratuit dont les connaissances ont une date limite, Gemini peut chercher sur le web en temps réel.

**Intégration avec Google Workspace** : Si vous utilisez Google Docs pour rédiger, Gemini peut analyser votre document directement. Dans Gmail, il peut résumer vos emails et rédiger des réponses.

## 💼 Cas d'usage où Gemini excelle

**Recherche d'actualités** : "Quelles sont les dernières nouvelles économiques du Sénégal aujourd'hui ?"

**Aide dans Google Docs** : Ouvrez un Google Doc → cliquez sur l'icône Gemini → demandez-lui de résumer, améliorer ou continuer votre texte.

**Analyse d'images** : Prenez une photo d'un problème de mathématiques ou d'un document et demandez à Gemini de l'analyser.

## 💡 Astuce du formateur

Si vous avez déjà un compte Gmail, vous pouvez accéder à Gemini gratuitement avec ce même compte. C'est l'IA la plus facile à démarrer pour la plupart des Africains qui ont déjà Gmail !

## ✏️ Exercice pratique

Ouvrez Gemini et posez cette question : "Quels sont les taux de change actuels entre le FCFA et l'euro et le dollar ?" Comparez la réponse avec celle de ChatGPT sur la même question. Laquelle est plus précise et pourquoi ?`,
          [
            {
              question: "Quel est l'avantage principal de Gemini par rapport au ChatGPT gratuit ?",
              options: [
                { text: "Gemini est gratuit et ChatGPT ne l'est pas", correct: false },
                { text: "Gemini peut accéder aux informations en temps réel sur le web", correct: true },
                { text: "Gemini parle plus de langues que ChatGPT", correct: false },
                { text: "Gemini est plus ancien et donc plus fiable", correct: false },
              ],
            },
            {
              question: "Comment accéder à Gemini si vous avez déjà un compte Gmail ?",
              options: [
                { text: "Il faut créer un nouveau compte séparé", correct: false },
                { text: "Il faut payer un abonnement Google One obligatoire", correct: false },
                { text: "Vous pouvez accéder directement avec votre compte Gmail existant sur gemini.google.com", correct: true },
                { text: "Il faut télécharger une application spéciale", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Claude d'Anthropic : l'IA éthique et précise",
          `## 🎯 Introduction

Claude est l'IA développée par Anthropic, une entreprise fondée en 2021 par d'anciens employés d'OpenAI. Claude est réputé pour sa précision, son éthique et sa capacité à traiter de très longs documents. C'est souvent le choix préféré des professionnels.

## 📚 Ce que vous allez apprendre
- Ce qui rend Claude unique
- Ses points forts par rapport aux autres IA
- Comment l'utiliser efficacement

## 🔍 Ce qui rend Claude unique

### 1. La fenêtre de contexte exceptionnelle
Claude peut traiter jusqu'à **200 000 tokens** (environ 150 000 mots) en une seule conversation. C'est l'équivalent d'un roman entier ! ChatGPT gratuit, lui, se limite à environ 4 000 tokens.

**En pratique** : Vous pouvez coller tout un rapport de 100 pages et demander à Claude de le résumer, d'en extraire des informations spécifiques ou de répondre à des questions dessus.

### 2. L'éthique au cœur de sa conception
Anthropic a développé une approche appelée **Constitutional AI** — Claude est entraîné à être utile, inoffensif et honnête. Il refuse poliment les demandes problématiques mais de manière moins restrictive que ChatGPT.

### 3. La précision dans les textes longs
Claude excelle particulièrement dans :
- La rédaction de textes longs et cohérents
- L'analyse de documents complexes
- Le code complexe
- Les discussions nuancées

## 💼 Cas d'usage concrets

**Pour les étudiants :** "Voici mon cours de 50 pages sur l'économie africaine [colle le texte]. Crée-moi 20 questions de révision avec leurs réponses."

**Pour les professionnels :** "Voici le contrat de 30 pages [colle le texte]. Identifie les clauses problématiques et résume les obligations de chaque partie."

**Pour les entrepreneurs :** "Voici les données de vente de mon entreprise des 12 derniers mois [colle les données]. Analyse les tendances et propose des recommandations."

## 💡 Astuce du formateur

Claude est disponible sur **claude.ai** avec une version gratuite. Utilisez-le particulièrement quand vous avez de longs documents à analyser — c'est là qu'il brille vraiment face aux autres IA.

## ✏️ Exercice pratique

Prenez un article de journal en français (4-5 paragraphes) et testez les 3 IA (ChatGPT, Gemini, Claude) avec la même demande : "Résume cet article en 3 points clés et donne ton avis critique." Comparez la qualité des réponses.`,
          [
            {
              question: "Quelle est la caractéristique principale qui distingue Claude des autres IA ?",
              options: [
                { text: "Claude est le seul outil gratuit d'IA", correct: false },
                { text: "Claude peut traiter des documents très longs grâce à sa grande fenêtre de contexte", correct: true },
                { text: "Claude peut générer des images et des vidéos", correct: false },
                { text: "Claude a été créé en Afrique", correct: false },
              ],
            },
            {
              question: "Qu'est-ce que la 'Constitutional AI' développée par Anthropic ?",
              options: [
                { text: "Une IA conçue pour rédiger des constitutions de pays", correct: false },
                { text: "Une approche d'entraînement pour rendre l'IA utile, inoffensive et honnête", correct: true },
                { text: "Un système de lois régissant l'utilisation de l'IA en Europe", correct: false },
                { text: "Une technologie pour protéger les droits d'auteur", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Microsoft Copilot : l'IA dans vos outils quotidiens",
          `## 🎯 Introduction

Microsoft Copilot est l'IA intégrée directement dans les outils Microsoft que vous connaissez déjà : Word, Excel, PowerPoint, Teams, Outlook. C'est l'IA la plus "pratique" pour le monde professionnel.

## 📚 Ce que vous allez apprendre
- Comment Copilot s'intègre dans les outils Microsoft
- Les fonctionnalités disponibles gratuitement
- Les cas d'usage les plus productifs

## 🔍 Les versions de Copilot

### Copilot gratuit (copilot.microsoft.com)
- Basé sur GPT-4 de manière gratuite !
- Recherche web en temps réel
- Génération d'images (DALL·E 3)
- Conversation avancée
- Accessible via le navigateur Edge

### Copilot dans Windows 11
Si vous utilisez Windows 11, Copilot est intégré dans la barre des tâches. Appuyez sur la touche Windows + C pour l'ouvrir à tout moment.

### Copilot Pro (payant) — Dans les applications Office
- **Word** : "Rédige un rapport de 2 pages sur ce sujet basé sur ces notes"
- **Excel** : "Analyse ces données et crée un graphique pertinent"
- **PowerPoint** : "Crée une présentation de 10 slides sur ce sujet"
- **Outlook** : "Résume mes emails non lus et rédige des réponses"

## 💼 Copilot dans Bing (gratuit !)

Une des meilleures fonctionnalités gratuites : Copilot dans le moteur de recherche Bing. Tapez votre question dans Bing et obtenez une réponse IA avec des sources vérifiables.

**Exemple :** Recherchez sur Bing "Comment créer une SRL au Sénégal ?" → Copilot vous donnera une réponse complète avec les étapes légales et des liens vers les sources officielles.

## 💡 Astuce du formateur

Si vous n'avez pas les moyens de payer ChatGPT Plus, **Copilot gratuit** vous donne accès à GPT-4 (le modèle premium d'OpenAI) gratuitement ! C'est l'une des meilleures opportunités gratuites du moment.

## ✏️ Exercice pratique

Allez sur **copilot.microsoft.com** sans créer de compte et testez : "Aide-moi à créer un plan de révision pour passer mon baccalauréat au Sénégal. J'ai 3 matières difficiles : Mathématiques, Physique et SVT."`,
          [
            {
              question: "Quel est l'avantage du Copilot gratuit de Microsoft ?",
              options: [
                { text: "Il est plus puissant que tous les autres IA du marché", correct: false },
                { text: "Il donne accès à GPT-4 gratuitement", correct: true },
                { text: "Il peut coder des applications complètes", correct: false },
                { text: "Il traduit automatiquement en langues africaines", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Perplexity AI : le moteur de recherche intelligent",
          `## 🎯 Introduction

Perplexity AI est une révolution dans la recherche d'informations. C'est un moteur de recherche qui répond à vos questions avec des sources vérifiables en temps réel, combinant la puissance des LLM avec la fraîcheur des informations web.

## 📚 Ce que vous allez apprendre
- Ce qui rend Perplexity unique parmi les IA
- Comment l'utiliser pour des recherches fiables
- Quand choisir Perplexity plutôt que ChatGPT

## 🔍 Ce qui rend Perplexity unique

### 1. Sources toujours citées
Contrairement à ChatGPT qui peut inventer des informations, **Perplexity cite toujours ses sources**. Chaque affirmation est accompagnée d'un numéro qui renvoie vers l'article ou le site source. Vous pouvez vérifier vous-même !

### 2. Informations en temps réel
Perplexity indexe le web en permanence. Vous pouvez lui demander les dernières nouvelles, les prix actuels, les événements récents.

### 3. Mode Focus
Vous pouvez spécifier où Perplexity doit chercher :
- **Web** : Internet général
- **Academic** : Articles scientifiques et académiques
- **YouTube** : Transcriptions de vidéos
- **Reddit** : Discussions communautaires
- **News** : Actualités récentes

## 💼 Exemples d'utilisation

**Pour les étudiants :**
"Quelles sont les dernières recherches scientifiques sur le traitement du paludisme en Afrique subsaharienne ?" → Perplexity vous donnera des articles académiques récents avec sources.

**Pour les entrepreneurs :**
"Quel est le marché de l'e-commerce au Sénégal en 2024 : taille, acteurs principaux, tendances ?" → Résultats actualisés avec statistiques sourcées.

**Pour les professionnels :**
"Quelles sont les nouvelles réglementations fiscales pour les PME au Sénégal en 2024 ?"

## 💡 Astuce du formateur

Utilisez Perplexity quand vous avez besoin d'informations **récentes et vérifiables**. Utilisez ChatGPT/Claude pour la créativité, la rédaction et les analyses complexes. Les deux outils sont complémentaires !

## ✏️ Exercice pratique

Comparez Perplexity avec Google sur la même question : "Quelles sont les meilleures universités d'Afrique de l'Ouest en 2024 ?" Notez les différences dans la présentation des résultats et la fiabilité des informations.`,
          [
            {
              question: "Quelle est la caractéristique principale qui distingue Perplexity des autres IA ?",
              options: [
                { text: "Perplexity peut générer des images et des vidéos", correct: false },
                { text: "Perplexity cite toujours ses sources et accède aux informations en temps réel", correct: true },
                { text: "Perplexity est le seul outil entièrement gratuit", correct: false },
                { text: "Perplexity parle toutes les langues africaines", correct: false },
              ],
            },
            {
              question: "Dans quel cas vaut-il mieux utiliser Perplexity plutôt que ChatGPT ?",
              options: [
                { text: "Pour rédiger un roman créatif", correct: false },
                { text: "Pour générer du code de programmation", correct: false },
                { text: "Pour rechercher des informations récentes et vérifiables avec sources", correct: true },
                { text: "Pour analyser un long document qu'on lui fournit", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Midjourney et DALL·E : créer des images par IA",
          `## 🎯 Introduction

Les IA génératrices d'images ont révolutionné la création visuelle. En quelques secondes et avec une simple description textuelle, vous pouvez créer des visuels professionnels. Découvrons les deux principaux outils.

## 📚 Ce que vous allez apprendre
- Comment fonctionnent les générateurs d'images IA
- Les différences entre Midjourney et DALL·E 3
- Comment écrire des prompts efficaces pour les images

## 🔍 Les deux outils principaux

### Midjourney
- **Accès** : Via Discord (midjourney.com)
- **Prix** : À partir de 10$/mois (pas de version gratuite actuellement)
- **Force** : Qualité artistique exceptionnelle, esthétique unique
- **Idéal pour** : Affiches artistiques, illustrations, art conceptuel

### DALL·E 3 (d'OpenAI)
- **Accès** : Via ChatGPT Plus ou Bing Image Creator (gratuit !)
- **Prix** : Gratuit via Bing, payant via ChatGPT Plus
- **Force** : Suit mieux les instructions précises, gère mieux le texte dans les images
- **Idéal pour** : Visuels marketing, illustrations précises

## 💡 Accès gratuit aux images IA

**Bing Image Creator** (images.bing.com) — Basé sur DALL·E 3, entièrement gratuit ! Créez jusqu'à 100 images de haute qualité par semaine.

**Adobe Firefly** — Version gratuite disponible, intégrée à Adobe Express.

**Canva IA** — Si vous avez Canva, la fonction "Magic Media" génère des images gratuitement.

## 💼 Comment écrire un bon prompt pour les images

La structure idéale : **[Sujet] + [Style] + [Détails] + [Format]**

**Exemple :**
"Un étudiant sénégalais souriant qui étudie sur un ordinateur dans une bibliothèque moderne à Dakar, style photographique réaliste, lumière naturelle, format portrait, haute qualité"

## ✏️ Exercice pratique

Allez sur **images.bing.com** et créez les images suivantes :
1. "Un entrepreneur africain présentant son application mobile à des investisseurs"
2. "Une salle de classe moderne en Afrique avec des tablettes numériques"
3. Votre propre idée créative

Partagez vos créations avec votre groupe !`,
          [
            {
              question: "Comment accéder gratuitement à la génération d'images IA de qualité professionnelle ?",
              options: [
                { text: "Il n'existe pas d'accès gratuit à la génération d'images IA", correct: false },
                { text: "Via Bing Image Creator qui est basé sur DALL·E 3 et entièrement gratuit", correct: true },
                { text: "Seulement en téléchargeant Midjourney sur votre téléphone", correct: false },
                { text: "En payant un abonnement à Adobe Photoshop", correct: false },
              ],
            },
            {
              question: "Quelle est la structure recommandée pour un prompt d'image IA efficace ?",
              options: [
                { text: "Juste une description très courte en 3 mots maximum", correct: false },
                { text: "Sujet + Style + Détails + Format", correct: true },
                { text: "Un paragraphe de 500 mots décrivant chaque pixel de l'image", correct: false },
                { text: "Copier-coller la description d'une autre image existante", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Choisir le bon outil selon votre besoin",
          `## 🎯 Introduction

Avec autant d'outils IA disponibles, le choix peut être paralysant. Cette leçon vous donne un guide pratique pour choisir le bon outil selon votre situation spécifique.

## 📚 Tableau de décision rapide

| Besoin | Meilleur outil |
|--------|---------------|
| Écrire un texte créatif | ChatGPT ou Claude |
| Infos récentes avec sources | Perplexity |
| Analyser un long document | Claude |
| Intégration Google (Docs, Gmail) | Gemini |
| Outils Microsoft (Word, Excel) | Copilot |
| Créer des images gratuitement | Bing Image Creator |
| Images artistiques premium | Midjourney |
| Coder et déboguer | ChatGPT ou GitHub Copilot |
| Recherche académique | Perplexity (mode Academic) |
| Tout faire gratuitement | ChatGPT + Gemini + Perplexity |

## 🔍 Stratégie optimale gratuite

**La stack gratuite parfaite :**
1. **ChatGPT (gratuit)** → Pour la rédaction, les questions complexes, le code
2. **Gemini (gratuit avec Gmail)** → Pour l'intégration Google et les infos actualisées
3. **Perplexity (gratuit)** → Pour les recherches avec sources vérifiables
4. **Bing Image Creator (gratuit)** → Pour générer des images

Avec ces 4 outils gratuits, vous couvrez 95% de vos besoins !

## 💡 Quand payer ?

Investissez dans ChatGPT Plus (20$/mois) si vous :
- Utilisez l'IA professionnellement tous les jours
- Avez besoin d'analyser des images
- Voulez les modèles les plus récents et puissants

## 💼 Cas pratiques

**Étudiant en thèse** → Perplexity (Academic) + Claude pour analyser les articles
**Entrepreneur débutant** → ChatGPT gratuit + Bing Image Creator + Gemini
**Créateur de contenu** → ChatGPT + Bing Image Creator + Canva IA
**Développeur** → ChatGPT ou GitHub Copilot

## ✏️ Exercice pratique

Définissez votre profil (étudiant, entrepreneur, créateur, professionnel) et créez votre "stack IA personnelle" : listez les 3 outils que vous allez utiliser en priorité et pour quels usages spécifiques. Testez chacun d'eux sur une tâche réelle cette semaine.`,
          [
            {
              question: "Quel outil est le plus adapté pour analyser un contrat de 50 pages ?",
              options: [
                { text: "Midjourney", correct: false },
                { text: "Perplexity", correct: false },
                { text: "Claude grâce à sa très grande fenêtre de contexte", correct: true },
                { text: "Bing Image Creator", correct: false },
              ],
            },
            {
              question: "Quelle est la combinaison optimale d'outils gratuits pour couvrir la plupart des besoins IA ?",
              options: [
                { text: "Uniquement ChatGPT gratuit suffit pour tout", correct: false },
                { text: "ChatGPT + Gemini + Perplexity + Bing Image Creator", correct: true },
                { text: "Il faut obligatoirement payer pour avoir des outils efficaces", correct: false },
                { text: "Google seul avec sa barre de recherche", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Bilan du Module 2 : maîtrisez votre boîte à outils IA",
          `## 🎯 Récapitulatif des outils découverts

Félicitations ! Vous avez maintenant une vue complète des principaux outils d'IA. Faisons le point.

## 📚 Résumé des outils

### 🤖 ChatGPT (OpenAI)
- **Force** : Polyvalent, excellent pour la rédaction et le code
- **Accès** : chat.openai.com — version gratuite disponible
- **Cas d'usage** : Rédaction, analyse, code, questions complexes

### 🌟 Google Gemini
- **Force** : Intégration Google, accès temps réel
- **Accès** : gemini.google.com — gratuit avec compte Google
- **Cas d'usage** : Intégration Docs/Gmail, recherches actualisées

### 🎭 Claude (Anthropic)
- **Force** : Longs documents, précision, éthique
- **Accès** : claude.ai — version gratuite disponible
- **Cas d'usage** : Analyse de documents longs, rédaction précise

### 🏢 Microsoft Copilot
- **Force** : Intégration Office, GPT-4 gratuit
- **Accès** : copilot.microsoft.com — gratuit
- **Cas d'usage** : Word, Excel, PowerPoint, Teams

### 🔍 Perplexity AI
- **Force** : Sources vérifiables, temps réel
- **Accès** : perplexity.ai — version gratuite
- **Cas d'usage** : Recherches avec sources, actualités

### 🎨 Midjourney & DALL·E
- **Force** : Création d'images artistiques
- **Accès** : Midjourney (payant), Bing Image Creator (gratuit)
- **Cas d'usage** : Affiches, illustrations, visuels marketing

## 🎯 Votre mission cette semaine

Créez un compte sur au moins 3 de ces outils et testez chacun avec la même question : "Comment puis-je améliorer ma productivité avec l'IA dans mes études ou mon travail ?"

Comparez les réponses et identifiez vos outils préférés.

## 💡 Conseil pour le module suivant

Le Module 3 sur le **Prompt Engineering** est le plus important de toute cette formation. La qualité de vos résultats avec tous ces outils dépend directement de la qualité de vos prompts. Préparez-vous à une leçon transformatrice !`,
          [
            {
              question: "Quel outil IA fonctionne spécifiquement avec Discord ?",
              options: [
                { text: "ChatGPT", correct: false },
                { text: "Claude", correct: false },
                { text: "Midjourney", correct: true },
                { text: "Perplexity", correct: false },
              ],
            },
            {
              question: "Pour obtenir des informations récentes sur les prix du marché au Sénégal, quel outil convient le mieux ?",
              options: [
                { text: "ChatGPT gratuit (sans accès internet)", correct: false },
                { text: "Claude pour les documents longs", correct: false },
                { text: "Perplexity AI pour ses informations en temps réel avec sources", correct: true },
                { text: "Midjourney pour créer des graphiques", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 3 : Le Prompt Engineering
    ══════════════════════════════════════════ */
    {
      title: "Module 3 : Le Prompt Engineering — L'Art de Parler à l'IA",
      lessons: [

        lesson(
          "Qu'est-ce qu'un prompt ?",
          `## 🎯 Introduction

Le **prompt** est l'instruction que vous donnez à une IA. C'est la clé qui ouvre ou ferme les portes de l'intelligence artificielle. Un mauvais prompt → une réponse médiocre. Un excellent prompt → une réponse extraordinaire.

## 📚 La règle d'or du prompt engineering

**"L'IA n'est pas devin. Elle produit exactement ce que vous lui demandez — ni plus, ni moins."**

Si vous demandez vaguement, vous obtenez une réponse vague. Si vous demandez précisément, vous obtenez une réponse précise.

## 🔍 La différence entre un mauvais et un bon prompt

### ❌ Mauvais prompt
"Parle-moi du CV."

**Résultat** : Une réponse générique sur ce qu'est un CV, sans utilité pratique pour vous.

### ✅ Bon prompt
"Tu es un recruteur RH avec 15 ans d'expérience dans les entreprises tech au Sénégal. Je suis un étudiant en informatique de 22 ans à l'UCAD, sans expérience professionnelle mais avec 3 projets personnels en Python. Rédige-moi un CV d'une page en format moderne pour postuler à un stage dans une startup fintech à Dakar. Format : sections clairement séparées, langage professionnel, points d'action quantifiés."

**Résultat** : Un CV personnalisé, professionnel, adapté à votre contexte.

## 💼 Les 6 composantes d'un prompt parfait

1. **Rôle** — Quel expert doit être l'IA ? ("Tu es un expert en...")
2. **Contexte** — Qui êtes-vous ? Quelle est votre situation ?
3. **Tâche** — Exactement ce que vous voulez
4. **Format** — Comment voulez-vous la réponse ?
5. **Ton** — Formel, informel, technique, simple ?
6. **Exemples** — Des exemples de ce que vous attendez (optionnel)

## 💡 Astuce du formateur

Traitez l'IA comme un assistant très compétent qui vient d'arriver et qui ne connaît pas votre contexte. Donnez-lui toutes les informations dont il a besoin pour faire du bon travail, exactement comme vous le feriez avec un nouvel employé.

## ✏️ Exercice pratique

Améliorez ce mauvais prompt : "Aide-moi pour mon business"

Réécrivez-le en intégrant les 6 composantes d'un bon prompt. Testez ensuite les deux versions sur ChatGPT et comparez les résultats.`,
          [
            {
              question: "Quelle est la règle d'or du prompt engineering ?",
              options: [
                { text: "L'IA comprend toujours ce que vous voulez, même sans explication", correct: false },
                { text: "Plus le prompt est court, mieux c'est pour l'IA", correct: false },
                { text: "L'IA produit exactement ce que vous demandez — un prompt vague donne une réponse vague", correct: true },
                { text: "Il suffit de poser des questions simples pour obtenir de bonnes réponses", correct: false },
              ],
            },
            {
              question: "Quelles sont les 6 composantes d'un prompt parfait ?",
              options: [
                { text: "Longueur, Vitesse, Couleur, Son, Humeur, Budget", correct: false },
                { text: "Rôle, Contexte, Tâche, Format, Ton, Exemples", correct: true },
                { text: "Question, Réponse, Vérification, Correction, Publication, Archivage", correct: false },
                { text: "Intelligence, Créativité, Précision, Rapidité, Fiabilité, Originalité", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "La structure d'un prompt efficace",
          `## 🎯 Introduction

Maintenant que vous comprenez ce qu'est un prompt, apprenons à construire méthodiquement des prompts qui donnent des résultats exceptionnels à chaque fois.

## 📚 La formule RTCFE

**R**ôle — **T**âche — **C**ontexte — **F**ormat — **E**xemple

### R — Rôle (Roleplay)
Donnez à l'IA un rôle spécifique. Cela active le bon "mode mental" de l'IA.

**Exemples de rôles :**
- "Tu es un professeur de mathématiques spécialisé dans la préparation au baccalauréat sénégalais"
- "Tu es un coach de carrière avec 20 ans d'expérience dans le recrutement en Afrique"
- "Tu es un avocat spécialisé en droit des affaires au Sénégal"
- "Tu es un expert en marketing digital pour PME africaines"

### T — Tâche
Soyez ultra-précis sur ce que vous voulez.

❌ "Aide-moi" → ✅ "Rédige 5 titres accrocheurs pour mon post LinkedIn"
❌ "Explique l'économie" → ✅ "Explique en 200 mots, avec 2 exemples du Sénégal, comment l'inflation affecte le pouvoir d'achat des ménages"

### C — Contexte
Donnez votre situation personnelle.

"Je suis étudiant en 2ème année de droit à l'UCAD, je prépare un exposé sur le droit commercial pour 30 étudiants qui débutent dans cette matière."

### F — Format
Précisez comment vous voulez la réponse.

- "En liste à puces"
- "En tableau avec 3 colonnes"
- "En 5 paragraphes de 100 mots chacun"
- "Avec des emojis pour chaque section"
- "Format Markdown"

### E — Exemple
Donnez un exemple de ce que vous attendez.

"Le style doit ressembler à ceci : [votre exemple]"

## 💼 Prompt complet avec RTCFE

"**[Rôle]** Tu es un entrepreneur expérimenté avec 10 ans d'expérience dans le commerce en ligne au Sénégal.

**[Tâche]** Aide-moi à créer un plan marketing pour lancer ma boutique de vente de pagnes en ligne.

**[Contexte]** Je suis une femme de 28 ans à Dakar, j'ai 500 000 FCFA de budget, et je veux cibler les diaspora sénégalaise en France et aux États-Unis.

**[Format]** Présente le plan en 5 étapes claires, avec pour chaque étape : l'action à mener, le budget estimé et le résultat attendu.

**[Exemple]** Le ton doit être pratique et concret, comme un conseiller qui parle directement à un ami entrepreneur."

## ✏️ Exercice pratique

Choisissez un problème réel que vous avez (études, travail, business, créativité) et écrivez un prompt RTCFE complet. Testez-le sur ChatGPT et évaluez la qualité de la réponse.`,
          [
            {
              question: "Dans la formule RTCFE, que signifie le 'R' ?",
              options: [
                { text: "Résultat attendu", correct: false },
                { text: "Rôle assigné à l'IA", correct: true },
                { text: "Recherche à effectuer", correct: false },
                { text: "Répétition de la question", correct: false },
              ],
            },
            {
              question: "Pourquoi donne-t-on un rôle à l'IA dans un prompt ?",
              options: [
                { text: "Pour rendre la conversation plus amusante", correct: false },
                { text: "Pour activer le bon 'mode mental' de l'IA et obtenir des réponses plus spécialisées", correct: true },
                { text: "Parce que l'IA ne répond pas sans attribution de rôle", correct: false },
                { text: "Pour limiter les hallucinations de l'IA", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Techniques avancées : chain-of-thought et few-shot",
          `## 🎯 Introduction

Au-delà des bases, il existe des techniques avancées de prompt engineering qui peuvent transformer radicalement la qualité des réponses de l'IA. Ces techniques sont utilisées par les professionnels et les chercheurs.

## 📚 Technique 1 : Chain-of-Thought (Chaîne de Pensée)

### Qu'est-ce que c'est ?
Le Chain-of-Thought consiste à demander à l'IA de **raisonner étape par étape** avant de donner sa réponse finale. Cela améliore considérablement la précision, surtout pour les problèmes complexes.

### Comment l'activer ?
Ajoutez simplement à la fin de votre prompt : **"Raisonne étape par étape."** ou **"Explique ton raisonnement avant de donner ta réponse."**

### Exemple
**Sans CoT :** "Si un commerçant achète 50 pagnes à 8 000 FCFA chacun et les revend avec une marge de 35%, quel est son bénéfice total ?" → L'IA peut faire une erreur.

**Avec CoT :** Même question + "Raisonne étape par étape."
→ L'IA décompose : coût total = 50 × 8 000 = 400 000 FCFA, marge = 35% × 400 000 = 140 000 FCFA, bénéfice = 140 000 FCFA. Beaucoup plus fiable !

## 📚 Technique 2 : Few-Shot Prompting (Exemples d'entraînement)

### Qu'est-ce que c'est ?
Vous donnez à l'IA 2-3 exemples du type de réponse que vous attendez, puis vous lui demandez de faire pareil pour votre cas.

### Exemple
"Voici comment je veux que tu classes des plaintes clients :

Plainte : 'Ma livraison n'est pas arrivée après 3 semaines.' → Catégorie : LIVRAISON, Urgence : HAUTE
Plainte : 'Le produit est de mauvaise qualité.' → Catégorie : QUALITÉ, Urgence : MOYENNE
Plainte : 'Comment puis-je retourner un article ?' → Catégorie : RETOUR, Urgence : BASSE

Maintenant classe ces nouvelles plaintes selon le même format : [liste de plaintes]"

## 📚 Technique 3 : Prompts itératifs

L'IA est votre collaborateur. Ne vous contentez pas d'une seule réponse — affinez !

- "C'est bien mais peux-tu rendre le ton plus formel ?"
- "Maintenant traduis ceci en langage simple pour un lycéen"
- "Ajoute 3 exemples concrets du contexte africain"
- "Raccourcis la réponse à 100 mots maximum"

## 💡 Astuce du formateur

La technique la plus puissante pour les débutants est la technique **"Agis comme..."** + **Chain-of-Thought**. Exemple : "Agis comme un expert comptable. Je vais te décrire ma situation financière. Analyse-la étape par étape et donne-moi tes recommandations."

## ✏️ Exercice pratique

Testez le Chain-of-Thought sur ce problème : "Un jeune entrepreneur sénégalais veut ouvrir une boutique de vêtements. Il a 300 000 FCFA. Le loyer mensuel est de 80 000 FCFA, le stock initial coûte 150 000 FCFA. Combien lui reste-t-il et pour combien de mois peut-il payer son loyer avec le reste ?" Comparez la réponse avec et sans "Raisonne étape par étape".`,
          [
            {
              question: "Comment active-t-on simplement la technique Chain-of-Thought ?",
              options: [
                { text: "En utilisant le mode Pro de ChatGPT uniquement", correct: false },
                { text: "En ajoutant 'Raisonne étape par étape' à la fin du prompt", correct: true },
                { text: "En posant la même question 3 fois de suite", correct: false },
                { text: "En écrivant le prompt en majuscules", correct: false },
              ],
            },
            {
              question: "Qu'est-ce que le Few-Shot Prompting ?",
              options: [
                { text: "Écrire des prompts très courts pour économiser des tokens", correct: false },
                { text: "Donner à l'IA des exemples du type de réponse attendue avant de lui poser la vraie question", correct: true },
                { text: "Poser plusieurs questions en même temps", correct: false },
                { text: "Utiliser l'IA seulement quelques fois par jour", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Les 10 erreurs courantes à éviter",
          `## 🎯 Introduction

Même avec de bonnes connaissances en prompt engineering, certaines erreurs reviennent constamment. Cette leçon vous présente les 10 erreurs les plus fréquentes et comment les corriger.

## 📚 Les 10 erreurs à éviter

### ❌ Erreur 1 : Le prompt trop vague
"Dis-moi quelque chose d'intéressant sur l'IA"
✅ **Correction** : "Donne-moi 3 faits surprenants sur l'IA qui impactent directement la vie en Afrique subsaharienne."

### ❌ Erreur 2 : Ne pas donner de contexte
"Comment améliorer mon CV ?"
✅ **Correction** : "Comment améliorer mon CV de comptable junior avec 2 ans d'expérience, qui postule à un poste de contrôleur de gestion dans une banque à Dakar ?"

### ❌ Erreur 3 : Accepter la première réponse
Si la première réponse n'est pas parfaite, demandez une amélioration ! "C'est bien mais peux-tu ..."

### ❌ Erreur 4 : Ne pas vérifier les informations
L'IA peut se tromper, surtout sur des faits précis comme des dates, des statistiques ou des lois locales.

### ❌ Erreur 5 : Poser trop de questions en même temps
❌ "Explique l'IA, donne des exemples, parle de ses limites, cite des statistiques et dis-moi comment l'apprendre"
✅ **Correction** : Posez une question à la fois.

### ❌ Erreur 6 : Ne pas préciser la longueur
Sans précision, l'IA peut donner une réponse trop longue ou trop courte.
✅ **Correction** : "En exactement 100 mots" ou "En 5 points maximum"

### ❌ Erreur 7 : Formater en langage SMS
"kf fer un cv plz" → L'IA comprend mais produit des résultats de moins bonne qualité.

### ❌ Erreur 8 : Oublier le format de sortie
Précisez toujours : liste, tableau, paragraphe, JSON, Markdown, etc.

### ❌ Erreur 9 : Ne pas persévérer dans la conversation
Utilisez la conversation ! "Maintenant, transforme ça en email", "Ajoute un exemple concret", "Simplifie le langage"

### ❌ Erreur 10 : Partager des informations confidentielles
Ne partagez JAMAIS avec l'IA : mots de passe, données bancaires, informations médicales privées, données clients confidentielles.

## 💡 Astuce du formateur

Gardez cette liste d'erreurs comme checklist. Avant d'envoyer un prompt, vérifiez rapidement : "Ai-je donné un contexte ? Un rôle ? Un format ? La bonne longueur ?"

## ✏️ Exercice pratique

Corrigez ces 3 mauvais prompts en appliquant les bonnes pratiques :
1. "Aide-moi avec ma présentation"
2. "C'est quoi le marketing ?"
3. "Écris quelque chose de motivant"`,
          [
            {
              question: "Quelle est l'une des erreurs les plus dangereuses quand on utilise l'IA ?",
              options: [
                { text: "Écrire des prompts trop longs", correct: false },
                { text: "Partager des informations confidentielles comme des mots de passe ou données bancaires", correct: true },
                { text: "Utiliser l'IA trop souvent dans la journée", correct: false },
                { text: "Poser des questions en français au lieu d'anglais", correct: false },
              ],
            },
            {
              question: "Que faire si la première réponse de l'IA n'est pas satisfaisante ?",
              options: [
                { text: "Recommencer depuis zéro avec un nouveau chat", correct: false },
                { text: "Abandonner et essayer un autre outil", correct: false },
                { text: "Continuer la conversation en demandant des améliorations spécifiques", correct: true },
                { text: "Accepter la réponse telle quelle car l'IA a toujours raison", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "30 templates de prompts prêts à l'emploi",
          `## 🎯 Introduction

Dans cette leçon, vous avez accès à 30 templates de prompts testés et optimisés pour les situations les plus courantes. Copiez-collez et adaptez selon vos besoins !

## 📚 Templates pour les études

**1. Résumé de cours**
"Tu es professeur de [matière]. Résume ce chapitre [colle le texte] en points clés, avec une définition pour chaque terme important et 2 exemples concrets pour chaque concept."

**2. Fiches de révision**
"Crée 10 fiches de révision Q&A sur ce sujet : [sujet]. Format : Question / Réponse courte / Explication en 2 lignes."

**3. Explication simple**
"Explique [concept difficile] comme si j'avais 15 ans. Utilise une analogie avec quelque chose de familier au Sénégal."

**4. Préparation d'exposé**
"Aide-moi à préparer un exposé de 10 minutes sur [sujet] pour une classe de [niveau]. Structure : Introduction accrocheuse, 3 points principaux, conclusion mémorable."

## 📚 Templates pour la carrière

**5. CV percutant**
"Tu es recruteur RH expert. Améliore ce CV [colle ton CV] pour un poste de [poste] dans [type d'entreprise]. Rends les descriptions plus dynamiques avec des verbes d'action et des résultats chiffrés."

**6. Lettre de motivation**
"Rédige une lettre de motivation percutante pour le poste de [poste] à [entreprise]. Contexte : [ta situation]. Ton : professionnel mais authentique. Longueur : 250 mots maximum."

**7. Préparation entretien**
"Tu es un recruteur chez [entreprise]. Je postule au poste de [poste]. Pose-moi 10 questions difficiles d'entretien et donne les meilleures façons d'y répondre."

## 📚 Templates pour les affaires

**8. Analyse de marché**
"Analyse le marché de [secteur] au Sénégal en 2024 : taille estimée, principaux acteurs, opportunités non exploitées, risques, et recommandations pour un nouvel entrant avec [budget]."

**9. Plan marketing**
"Crée un plan marketing sur 3 mois pour [produit/service] ciblant [audience] à [localisation], avec un budget de [montant]. Format : tableau avec semaines, actions, canaux et KPIs."

**10. Email professionnel**
"Rédige un email professionnel pour [objectif]. Ton : [formel/informel]. Destinataire : [qui]. Longueur : [courte/moyenne/longue]."

## 📚 Templates pour la productivité

**11. Résumé de réunion**
"Transforme ces notes de réunion en compte-rendu professionnel : [notes]. Format : Décisions prises, Actions à mener (avec responsable et délai), Points de suivi."

**12. Amélioration de texte**
"Améliore ce texte en le rendant plus [professionnel/clair/accrocheur/court]. Garde le sens original mais optimise le style : [colle ton texte]"

**13. Brainstorming**
"Tu es un expert en créativité. Génère 20 idées originales pour [problème/projet]. Pense hors des sentiers battus et inclus des idées surprenantes adaptées au contexte africain."

## ✏️ Exercice pratique

Choisissez 3 templates de cette liste qui correspondent à vos besoins actuels. Adaptez-les à votre contexte personnel et testez-les sur ChatGPT. Notez les résultats et gardez les meilleurs dans un fichier personnel.`,
          [
            {
              question: "Pourquoi utiliser des templates de prompts plutôt que d'écrire depuis zéro ?",
              options: [
                { text: "Parce que l'IA ne comprend que les prompts standardisés", correct: false },
                { text: "Pour gagner du temps tout en appliquant les meilleures pratiques de prompt engineering", correct: true },
                { text: "Parce que les prompts créatifs ne fonctionnent jamais", correct: false },
                { text: "Pour éviter que l'IA refuse de répondre", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Créer vos propres prompts système",
          `## 🎯 Introduction

Un prompt système est une instruction permanente que vous donnez à l'IA au début de chaque conversation. C'est comme programmer votre assistant personnel pour qu'il vous réponde toujours de la manière qui vous convient le mieux.

## 📚 Qu'est-ce qu'un prompt système ?

Un prompt système est une instruction initiale qui définit :
- Le rôle permanent de l'IA
- Votre contexte et vos préférences
- Le format de réponse souhaité
- Les règles à suivre à chaque fois

## 🔍 Comment créer votre prompt système personnel

### Template de prompt système universel

"**Contexte de l'utilisateur :**
- Je suis [qui vous êtes : étudiant en informatique, entrepreneur, etc.]
- Localisation : [Dakar, Sénégal]
- Langue préférée : Français, avec des exemples africains quand possible
- Niveau de connaissance : [débutant/intermédiaire/avancé] dans [domaine]

**Mes préférences de réponse :**
- Format : [liste à puces / paragraphes / tableaux]
- Longueur : [courte (100 mots) / moyenne (300 mots) / longue selon besoin]
- Ton : [professionnel / casual / pédagogique]
- Exemples : Toujours utiliser des exemples concrets du contexte sénégalais ou africain quand possible

**Règles importantes :**
- Si tu n'es pas sûr d'une information, dis-le clairement
- Si ma question est trop vague, demande des précisions avant de répondre
- Propose toujours des actions concrètes et réalisables"

## 💼 Exemples de prompts système par profil

**Pour un étudiant :**
"Je suis étudiant en 3ème année de médecine à l'UCAD. Quand tu m'expliques des concepts, utilise des analogies simples. Donne toujours des exemples de maladies courantes en Afrique de l'Ouest."

**Pour un entrepreneur :**
"Je suis fondateur d'une startup tech à Dakar. Toutes mes décisions doivent tenir compte du contexte africain : accès internet limité, paiement mobile dominant, marché jeune. Adapte toujours tes recommandations à ces réalités."

## 💡 Astuce du formateur

Sur ChatGPT, vous pouvez paramétrer des instructions personnalisées permanentes dans Paramètres → Instructions personnalisées. Ces instructions s'appliquent à toutes vos conversations automatiquement !

## ✏️ Exercice pratique

Créez votre prompt système personnel en remplissant le template. Copiez-le dans les paramètres de ChatGPT (Instructions personnalisées) et testez-le sur 3 conversations différentes. Affinez-le selon vos observations.`,
          [
            {
              question: "Qu'est-ce qu'un prompt système ?",
              options: [
                { text: "Un prompt qui permet à l'IA de pirater des systèmes informatiques", correct: false },
                { text: "Une instruction initiale permanente qui définit le comportement de l'IA dans toutes vos conversations", correct: true },
                { text: "Un prompt très long qui prend tout l'espace disponible", correct: false },
                { text: "Le code source de l'IA lui-même", correct: false },
              ],
            },
            {
              question: "Où peut-on configurer des instructions personnalisées permanentes sur ChatGPT ?",
              options: [
                { text: "Dans les paramètres → Instructions personnalisées", correct: true },
                { text: "Il faut contacter le support OpenAI par email", correct: false },
                { text: "C'est impossible de configurer ça en version gratuite", correct: false },
                { text: "Dans le code HTML de la page web", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Bilan et quiz final : êtes-vous un bon prompteur ?",
          `## 🎯 Récapitulatif du Prompt Engineering

Félicitations ! Vous venez de maîtriser l'une des compétences les plus précieuses du XXIe siècle. Le prompt engineering est ce qui sépare les utilisateurs ordinaires de l'IA de ceux qui en tirent une valeur exceptionnelle.

## 📚 Ce que vous maîtrisez maintenant

### ✅ Les fondamentaux
- Un prompt vague → réponse vague. Un prompt précis → réponse précise.
- La formule RTCFE : Rôle + Tâche + Contexte + Format + Exemple

### ✅ Les techniques avancées
- **Chain-of-Thought** : "Raisonne étape par étape"
- **Few-Shot** : Donner des exemples avant la vraie question
- **Prompts itératifs** : Affiner dans la même conversation

### ✅ Les erreurs à éviter
- Trop vague, pas de contexte, pas de format précisé
- Ne jamais partager d'informations confidentielles
- Ne pas s'arrêter à la première réponse

### ✅ Vos outils pratiques
- 30 templates prêts à l'emploi
- Votre prompt système personnalisé
- La checklist de qualité

## 🎯 Votre niveau de compétence

Après ce module, vous êtes capables de :
- Rédiger des prompts qui obtiennent des résultats 10x meilleurs
- Adapter vos prompts selon l'outil (ChatGPT, Claude, Gemini)
- Créer des prompts pour n'importe quelle situation professionnelle

## 💡 Pour le prochain module

Dans le Module 4, nous allons appliquer toutes ces compétences de prompt engineering pour des cas très concrets : **l'IA pour les étudiants**. Vous allez voir comment transformer votre façon d'apprendre et de travailler.

## ✏️ Exercice final

Écrivez votre meilleur prompt pour le défi suivant : "Aidez un lycéen sénégalais de Terminale à réviser les mathématiques pour le BAC dans 3 semaines." Ce prompt doit utiliser toutes les techniques apprises dans ce module.`,
          [
            {
              question: "Qu'est-ce que la formule RTCFE ?",
              options: [
                { text: "Un type de fichier informatique", correct: false },
                { text: "Rôle + Tâche + Contexte + Format + Exemple — la structure d'un prompt parfait", correct: true },
                { text: "Un acronyme d'une organisation africaine de l'IA", correct: false },
                { text: "Une technique de programmation pour les IA", correct: false },
              ],
            },
            {
              question: "Lequel de ces prompts est le meilleur exemple de prompt engineering ?",
              options: [
                { text: "\"Aide-moi\"", correct: false },
                { text: "\"Parle-moi d'entreprise\"", correct: false },
                { text: "\"Tu es un expert comptable. Je suis une vendeuse de rue à Dakar avec 200 000 FCFA de revenus mensuels. Explique-moi en 5 étapes simples comment gérer mon argent pour épargner 20% chaque mois. Format : liste numérotée avec action concrète et montant exact.\"", correct: true },
                { text: "\"Donne-moi des informations\"", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 4 : IA pour les étudiants
    ══════════════════════════════════════════ */
    {
      title: "Module 4 : L'IA pour les Étudiants",
      lessons: [

        lesson(
          "Résumer un cours avec l'IA",
          `## 🎯 Introduction

L'une des tâches les plus chronophages pour un étudiant est de résumer ses cours. L'IA peut réduire ce temps de 80% tout en améliorant la qualité de vos résumés. Voici comment faire.

## 🔍 Méthode 1 : Résumé par colle-colle

Copiez votre cours dans ChatGPT et utilisez ce prompt :
"Résume ce cours en suivant cette structure :
1. **L'essentiel en 5 points** (les concepts fondamentaux)
2. **Définitions clés** (termes importants avec leur définition simple)
3. **À retenir absolument** (les points qui tombent le plus souvent aux examens)
4. **Connexions** (liens avec d'autres cours ou sujets)
[Colle ton cours ici]"

## 🔍 Méthode 2 : Résumé par photo

Avec ChatGPT Plus ou Gemini, vous pouvez **photographier vos notes manuscrites** et demander à l'IA de les résumer ! Plus besoin de taper le texte.

## 🔍 Méthode 3 : Résumé structuré par niveaux

"Tu es professeur de [matière] au niveau [lycée/licence/master]. Crée un résumé de ce chapitre à 3 niveaux :
- Niveau 1 (pour un élève en difficulté) : les 3 points absolument essentiels
- Niveau 2 (pour un élève moyen) : résumé complet en 200 mots
- Niveau 3 (pour un excellent élève) : analyse approfondie avec nuances et limites
[Colle ton cours]"

## 💼 Exemple concret

**Cours de 20 pages sur la thermodynamique :**
En 30 secondes, l'IA produit :
- 5 lois fondamentales expliquées simplement
- 10 définitions clés
- 3 exemples de la vie réelle
- Questions types d'examen avec réponses

Résultat : Ce qui prenait 3 heures de travail se fait en 30 minutes !

## 💡 Astuce du formateur

Ne copiez pas bêtement le résumé de l'IA — **lisez-le activement** et ajoutez vos propres notes. L'IA fait le premier tri, vous faites l'apprentissage.

## ✏️ Exercice pratique

Prenez votre cours le plus difficile. Résumez-le manuellement en 30 minutes. Puis demandez à l'IA de le résumer. Comparez les deux résumés et identifiez ce que vous aviez manqué.`,
          [
            {
              question: "Quelle est la meilleure utilisation de l'IA pour résumer un cours ?",
              options: [
                { text: "Laisser l'IA tout faire et copier-coller la réponse dans votre cahier", correct: false },
                { text: "Utiliser l'IA pour le premier tri et résumé, puis compléter avec votre lecture active", correct: true },
                { text: "Utiliser l'IA seulement pour les cours d'informatique", correct: false },
                { text: "Ne jamais utiliser l'IA pour les résumés car ça empêche d'apprendre", correct: false },
              ],
            },
            {
              question: "Avec ChatGPT Plus ou Gemini, quelle fonctionnalité facilite encore plus la prise de résumé ?",
              options: [
                { text: "La génération automatique de podcasts", correct: false },
                { text: "La possibilité de photographier des notes manuscrites et de les faire analyser", correct: true },
                { text: "La traduction automatique en 50 langues", correct: false },
                { text: "La création automatique de vidéos explicatives", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Créer des fiches de révision intelligentes",
          `## 🎯 Introduction

Les fiches de révision sont l'outil de mémorisation le plus efficace. Mais les créer manuellement prend énormément de temps. L'IA peut créer des fiches de révision de qualité professionnelle en quelques secondes.

## 🔍 Type 1 : Fiches Questions-Réponses (Flash Cards)

"Crée 20 flash cards pour réviser ce cours. Format :
**Q :** [Question directe et précise]
**R :** [Réponse courte et mémorable — max 2 lignes]
[Colle ton cours]"

## 🔍 Type 2 : Fiches par concept

"Pour chaque concept clé de ce cours, crée une fiche avec :
- **Nom du concept**
- **Définition en 1 phrase**
- **Exemple concret du quotidien**
- **Lien avec un autre concept du cours**
- **Question type d'examen**"

## 🔍 Type 3 : Fiches mnémotechniques

"Crée des moyens mnémotechniques pour retenir les points clés de ce chapitre : acronymes, histoires, associations d'idées. Les exemples doivent être amusants et liés à la culture sénégalaise."

## 🔍 Type 4 : Mind Map textuel

"Crée un mind map textuel de ce cours avec :
- Le concept central
- Les 5 branches principales
- 3 sous-branches pour chaque branche
- Des connexions entre les branches"

## 💼 Plan de révision complet avec l'IA

"Tu es mon coach de révision. Mon examen de [matière] est dans [X] semaines. Voici mes notes de cours [colle les notes]. Crée pour moi :
1. Un planning de révision jour par jour
2. Les fiches de révision prioritaires
3. Une liste de 30 questions d'examen probables avec réponses
4. Les 5 erreurs classiques à éviter pour cet examen"

## 💡 Astuce du formateur

Utilisez la technique de la **Répétition Espacée** : révisez les fiches J+1, J+3, J+7, J+14. Demandez à l'IA de vous créer un planning de répétition espacée personnalisé pour votre examen !

## ✏️ Exercice pratique

Créez des flash cards pour votre prochain contrôle. Testez-vous vous-même dessus sans regarder les réponses. Notez votre score et demandez à l'IA de créer des explications supplémentaires pour les questions que vous avez ratées.`,
          [
            {
              question: "Qu'est-ce que la technique de répétition espacée ?",
              options: [
                { text: "Réviser uniquement la nuit avant un examen", correct: false },
                { text: "Revoir les fiches à intervalles croissants (J+1, J+3, J+7...) pour optimiser la mémorisation", correct: true },
                { text: "Faire de nombreuses pauses entre chaque session de révision", correct: false },
                { text: "Réviser la même chose 10 fois de suite sans s'arrêter", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Préparer un exposé ou une présentation",
          `## 🎯 Introduction

Présenter devant un groupe peut être stressant. L'IA peut vous aider à créer un exposé structuré, convaincant et mémorable en beaucoup moins de temps.

## 🔍 Étape 1 : Structure de l'exposé

"Tu es un expert en communication orale et présentation. Je dois faire un exposé de [durée] sur [sujet] devant [audience]. Crée-moi :
1. Un plan en 3 parties avec transitions fluides
2. Une introduction accrocheuse (anecdote ou statistique surprenante)
3. Les 3 arguments principaux avec exemples africains
4. Une conclusion mémorable avec call-to-action
5. 5 questions probables du jury et les meilleures réponses"

## 🔍 Étape 2 : Contenu de chaque slide

"Pour ma présentation sur [sujet], crée le contenu de 10 slides :
Slide 1 : Titre accrocheur et sous-titre
Slide 2-8 : [Points principaux]
Slide 9 : Points clés à retenir
Slide 10 : Questions et discussion

Pour chaque slide : titre + 3-4 points clés maximum + message principal"

## 🔍 Étape 3 : Script de présentation orale

"Rédige un script de présentation pour cet exposé [colle le plan]. Le script doit :
- Durer exactement [durée] minutes
- Être naturel et conversationnel, pas académique
- Inclure des pauses stratégiques et des questions rhétoriques
- Mentionner des exemples concrets du Sénégal"

## 🔍 Étape 4 : Entraînement avec l'IA

"Je vais te présenter mon exposé. Tu joues le rôle d'un jury critique. Évalue ma présentation sur : clarté (1-10), structure (1-10), conviction (1-10), exemples (1-10). Donne des retours précis et constructifs."

## 💡 Astuce du formateur

Utilisez **Gamma.app** — un outil IA gratuit qui crée automatiquement des présentations PowerPoint entières à partir d'un texte ! Tapez votre plan et obtenez des slides professionnels en 2 minutes.

## ✏️ Exercice pratique

Choisissez un sujet de votre cours actuel. Demandez à l'IA de créer un exposé de 5 minutes. Entraînez-vous à le présenter oralement, puis demandez à l'IA de jouer le rôle du jury pour vous évaluer.`,
          [
            {
              question: "Quel outil IA gratuit peut créer automatiquement des présentations PowerPoint entières ?",
              options: [
                { text: "Microsoft Word", correct: false },
                { text: "Gamma.app", correct: true },
                { text: "Adobe Photoshop", correct: false },
                { text: "Google Forms", correct: false },
              ],
            },
            {
              question: "Comment l'IA peut-elle aider à s'entraîner pour un exposé oral ?",
              options: [
                { text: "Elle peut générer des images pour accompagner la présentation", correct: false },
                { text: "Elle peut jouer le rôle du jury, écouter la présentation et donner des retours critiques", correct: true },
                { text: "Elle peut parler à votre place pendant l'exposé", correct: false },
                { text: "Elle peut enregistrer et diffuser votre exposé en direct", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Corriger et améliorer vos travaux écrits",
          `## 🎯 Introduction

Rédiger un texte de qualité professionnelle demande de maîtriser la grammaire, le style, la structure et l'argumentation. L'IA est un correcteur et rédacteur extraordinaire qui peut transformer vos écrits.

## 🔍 Niveau 1 : Correction grammaticale et orthographique

"Corrige toutes les fautes d'orthographe, de grammaire et de syntaxe dans ce texte. Ne change pas le sens ni le style — uniquement les erreurs :
[Colle ton texte]"

## 🔍 Niveau 2 : Amélioration du style

"Améliore le style de ce texte pour le rendre plus :
- Fluide et agréable à lire
- Varié (évite les répétitions)
- Précis (remplace les mots vagues par des mots précis)
- Convaincant (renforce l'argumentation)
Garde le sens et la structure originale.
[Colle ton texte]"

## 🔍 Niveau 3 : Restructuration complète

"Analyse ce texte et identifie ses faiblesses. Propose une version améliorée avec :
1. Une introduction plus accrocheuse
2. Une meilleure progression logique des arguments
3. Des transitions plus fluides entre les paragraphes
4. Une conclusion plus percutante
[Colle ton texte]"

## 🔍 Niveau 4 : Adaptation au style académique

"Transforme ce texte pour qu'il respecte les normes académiques universitaires :
- Vocabulaire scientifique approprié
- Structure introduction-développement-conclusion
- Argumentation logique avec preuves
- Ton objectif et nuancé
- Suppression du 'je' personnel (sauf si demandé)
[Colle ton texte]"

## 💡 Astuce du formateur

Ne demandez JAMAIS à l'IA de rédiger entièrement votre devoir à votre place si c'est interdit par votre institution. Utilisez-la pour **corriger et améliorer** — c'est éthique et pédagogique car vous apprenez en comparant votre version et la version améliorée.

## ✏️ Exercice pratique

Prenez un texte que vous avez rédigé (dissertation, rapport, email). Passez-le par les 4 niveaux de correction IA. Pour chaque niveau, notez ce qui a changé et pourquoi. Identifiez vos patterns d'erreurs les plus fréquents.`,
          [
            {
              question: "Quelle utilisation de l'IA est éthiquement acceptable pour améliorer un devoir ?",
              options: [
                { text: "Demander à l'IA d'écrire entièrement le devoir à votre place et le soumettre comme votre travail", correct: false },
                { text: "Utiliser l'IA pour corriger les erreurs et améliorer le style d'un texte que vous avez rédigé", correct: true },
                { text: "Copier exactement les réponses d'un autre étudiant assisté par IA", correct: false },
                { text: "Utiliser l'IA pendant un examen surveillé pour répondre aux questions", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Apprendre une nouvelle matière avec l'IA",
          `## 🎯 Introduction

L'IA peut devenir votre professeur particulier disponible 24h/24. Elle s'adapte à votre niveau, répond à toutes vos questions et explique les concepts de multiples façons jusqu'à ce que vous compreniez.

## 🔍 Méthode 1 : Le Professeur Socratique

"Tu es mon professeur de [matière]. Enseigne-moi [concept] selon la méthode socratique : pose-moi des questions pour m'amener à découvrir les réponses par moi-même. Commence par évaluer mon niveau de connaissances actuel."

## 🔍 Méthode 2 : Les 5 niveaux d'explication

"Explique-moi [concept] à 5 niveaux différents :
1. Pour un enfant de 10 ans
2. Pour un lycéen
3. Pour un étudiant universitaire
4. Pour un professionnel du domaine
5. Pour un expert avec des détails techniques avancés"

## 🔍 Méthode 3 : Apprentissage par analogies

"J'ai du mal à comprendre [concept difficile]. Explique-le avec une analogie de la vie quotidienne au Sénégal. Puis donne 3 exemples progressifs du plus simple au plus complexe."

## 🔍 Méthode 4 : Test de compréhension adaptatif

"Tu es mon tuteur en [matière]. Je pense comprendre [concept]. Pose-moi 5 questions de difficulté croissante pour tester ma compréhension réelle. Après chaque réponse, dis-moi si c'est correct et explique pourquoi."

## 💡 Méthode 5 : Apprentissage par projets

"Je veux apprendre [compétence/matière] en 30 jours. Crée-moi un plan d'apprentissage progressif avec :
- Un projet pratique à réaliser (pour appliquer ce que j'apprends)
- Les ressources gratuites recommandées
- Les jalons hebdomadaires
- Des mini-tests quotidiens"

## 💡 Astuce du formateur

L'IA est particulièrement puissante pour les matières où vous avez peur de poser des questions "stupides" en classe. Avec l'IA, vous pouvez demander la même chose 10 fois différemment sans jugement !

## ✏️ Exercice pratique

Choisissez un concept de votre cours que vous ne comprenez pas bien. Utilisez la méthode des "5 niveaux d'explication". Identifiez le niveau où vous commencez à comprendre. Continuez à partir de ce niveau.`,
          [
            {
              question: "Quel avantage unique offre l'IA comme professeur particulier ?",
              options: [
                { text: "Elle peut passer vos examens à votre place", correct: false },
                { text: "Elle est disponible 24h/24, sans jugement, et s'adapte à votre niveau", correct: true },
                { text: "Elle peut enseigner mieux qu'un vrai professeur dans tous les cas", correct: false },
                { text: "Elle certifie vos compétences avec des diplômes officiels", correct: false },
              ],
            },
            {
              question: "Qu'est-ce que la méthode socratique appliquée avec l'IA ?",
              options: [
                { text: "L'IA donne toutes les réponses directement sans questions", correct: false },
                { text: "L'IA pose des questions pour vous amener à découvrir les réponses par vous-même", correct: true },
                { text: "L'IA évalue vos compétences pour vous donner une note", correct: false },
                { text: "L'IA lit des textes grecs anciens à voix haute", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Organiser son planning d'études avec l'IA",
          `## 🎯 Introduction

La gestion du temps est la compétence qui différencie les étudiants qui réussissent de ceux qui échouent. L'IA peut créer des plannings d'études personnalisés, optimisés et réalistes.

## 🔍 Comment créer votre planning optimal

**Prompt complet :**
"Tu es un coach en productivité académique. Voici ma situation :
- Matières à réviser : [liste avec niveau de difficulté]
- Date de l'examen : [date]
- Disponibilité quotidienne : [heures par jour et quelles plages horaires]
- Points forts : [matières où je suis bon]
- Points faibles : [matières où j'ai des difficultés]
- Contraintes : [activités, obligations, fatigue]

Crée-moi un planning de révision :
1. Semaine par semaine jusqu'à l'examen
2. Avec les matières prioritaires en premier
3. En respectant les principes de la science cognitive (répétition espacée, alternance des matières)
4. Avec des pauses stratégiques et une journée de repos
5. Un tableau récapitulatif clair"

## 🔍 Techniques de productivité que l'IA peut vous enseigner

**Pomodoro :** 25 minutes de travail, 5 minutes de pause. Demandez à l'IA de créer un planning Pomodoro pour votre journée.

**Time-blocking :** Bloquer des créneaux spécifiques pour des matières spécifiques. Plus efficace que le travail à flux libre.

**La règle des 2 minutes :** Toute tâche qui prend moins de 2 minutes, faites-la immédiatement.

## 💡 Application pratique

"Voici mes activités de demain [liste]. Aide-moi à optimiser ma journée selon la méthode time-blocking. Mets les tâches difficiles le matin (quand le cerveau est frais) et les tâches plus légères l'après-midi."

## ✏️ Exercice pratique

Listez toutes vos matières et examens à venir. Donnez ces informations à l'IA et demandez-lui de créer votre planning de révision pour les 2 prochaines semaines. Suivez ce planning rigoureusement et notez votre progression.`,
          [
            {
              question: "Qu'est-ce que la technique Pomodoro ?",
              options: [
                { text: "Une technique de mémorisation basée sur la répétition", correct: false },
                { text: "25 minutes de travail concentré suivi de 5 minutes de pause", correct: true },
                { text: "Étudier pendant 8 heures d'affilée sans pause", correct: false },
                { text: "Une méthode de prise de notes en forme de tomate", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Projet : révisez votre prochain examen avec l'IA",
          `## 🎯 Projet pratique — Révision complète avec l'IA

C'est le moment de tout appliquer ! Dans cette leçon-projet, vous allez créer un système de révision complet pour votre prochain examen en utilisant toutes les techniques apprises.

## 📚 Étape 1 : Audit de vos connaissances (10 min)

"Tu es professeur de [matière]. Je passe mon examen dans [X semaines]. Pose-moi 10 questions de niveau croissant pour évaluer mes connaissances actuelles. Après mes réponses, identifie mes lacunes prioritaires."

## 📚 Étape 2 : Plan de révision personnalisé (5 min)

À partir de l'audit, créez votre plan de révision personnalisé (voir leçon précédente).

## 📚 Étape 3 : Fiches de révision (20 min)

Pour chaque thème identifié comme lacunaire, créez des fiches de révision (voir leçon sur les fiches).

## 📚 Étape 4 : Simulation d'examen (30 min)

"Tu es le jury de l'examen de [matière] niveau [niveau]. Crée pour moi un examen blanc complet qui ressemble exactement au vrai examen :
- Durée : [X heures]
- Types de questions similaires aux vrais examens
- Barème de notation
- Corrigé détaillé pour auto-évaluation"

## 📚 Étape 5 : Analyse des erreurs (15 min)

"J'ai répondu à cet examen blanc [colle tes réponses]. Corrige-moi en détail. Pour chaque erreur :
1. Explique pourquoi ma réponse est fausse
2. Donne la bonne réponse avec explication
3. Identifie la lacune de compréhension derrière l'erreur
4. Propose comment mémoriser la bonne réponse"

## 📚 Étape 6 : Révision ciblée des erreurs

Concentrez votre révision sur les thèmes où vous avez fait le plus d'erreurs.

## 💡 Astuce finale

La combinaison **examen blanc + correction détaillée + révision ciblée** est la méthode de révision la plus efficace scientifiquement prouvée. L'IA rend cette méthode accessible et personnalisable pour chaque étudiant !

## ✏️ Résultats attendus

En appliquant ce système sur 2-3 semaines avant un examen, vous devriez voir une amélioration de **15 à 30 points** par rapport à votre niveau habituel. Testez et partagez vos résultats !`,
          [
            {
              question: "Quelle est la méthode de révision scientifiquement la plus efficace selon cette leçon ?",
              options: [
                { text: "Lire le cours 10 fois de suite sans s'arrêter", correct: false },
                { text: "Examen blanc + correction détaillée + révision ciblée des erreurs", correct: true },
                { text: "Étudier uniquement la veille de l'examen pendant toute la nuit", correct: false },
                { text: "Mémoriser uniquement les résumés de l'IA sans les comprendre", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 5 : IA pour la recherche d'emploi
    ══════════════════════════════════════════ */
    {
      title: "Module 5 : L'IA pour la Recherche d'Emploi",
      lessons: [

        lesson(
          "Créer un CV professionnel avec l'IA",
          `## 🎯 Introduction

Un CV est votre première impression auprès d'un recruteur. Il a en moyenne **7 secondes** pour capter l'attention. L'IA peut vous aider à créer un CV qui se démarque vraiment.

## 🔍 Le prompt CV parfait

"Tu es un expert recruteur avec 15 ans d'expérience dans [secteur] en Afrique de l'Ouest. Crée-moi un CV professionnel pour le poste de [poste] avec ces informations :

**Mon profil :**
- Nom : [votre nom]
- Niveau d'études : [diplôme, établissement]
- Expériences : [listez vos expériences, même informelles]
- Compétences : [listez vos compétences techniques et soft skills]
- Projets : [projets personnels, associatifs, bénévolat]
- Langues : [langues parlées]
- Localisation : [ville]

**Le poste ciblé :**
- Intitulé : [poste]
- Entreprise : [si connue]
- Secteur : [secteur]

**Format souhaité :**
- 1 page maximum
- Sections : Profil professionnel, Expériences, Formation, Compétences, Langues
- Verbes d'action dynamiques (développé, créé, géré, optimisé...)
- Résultats chiffrés quand possible"

## 🔍 Adapter votre CV pour chaque offre

"Voici mon CV [colle ton CV] et voici l'offre d'emploi [colle l'offre]. Adapte mon CV pour cette offre spécifique :
1. Mets en avant les compétences qui correspondent à l'offre
2. Utilise les mots-clés de l'offre (important pour les systèmes ATS)
3. Réordonne les sections selon les priorités du recruteur
4. Améliore les formulations pour maximiser l'impact"

## 💡 Les systèmes ATS (Applicant Tracking System)

De nombreuses grandes entreprises utilisent des logiciels qui **scannent les CV automatiquement** avant qu'un humain ne les lise. Ces logiciels cherchent des mots-clés spécifiques de l'offre d'emploi.

**Astuce :** Demandez à l'IA : "Quels mots-clés dois-je inclure dans mon CV pour passer les filtres ATS pour ce poste [colle l'offre] ?"

## ✏️ Exercice pratique

Créez votre CV avec l'IA. Ensuite, demandez à l'IA de jouer le rôle d'un recruteur et d'évaluer votre CV sur une échelle de 1 à 10, avec des recommandations d'amélioration précises.`,
          [
            {
              question: "Qu'est-ce qu'un système ATS dans le contexte du recrutement ?",
              options: [
                { text: "Un test psychologique obligatoire avant un entretien", correct: false },
                { text: "Un logiciel qui scanne automatiquement les CV pour filtrer les candidats selon des mots-clés", correct: true },
                { text: "Un service de vérification des diplômes en ligne", correct: false },
                { text: "Un type de contrat de travail africain", correct: false },
              ],
            },
            {
              question: "Combien de secondes a en moyenne un recruteur pour regarder un CV ?",
              options: [
                { text: "30 minutes", correct: false },
                { text: "1 minute", correct: false },
                { text: "7 secondes", correct: true },
                { text: "5 minutes", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Rédiger une lettre de motivation percutante",
          `## 🎯 Introduction

La lettre de motivation est votre chance de convaincre un recruteur que vous êtes LA personne pour ce poste. L'IA peut vous aider à rédiger une lettre authentique, personnalisée et percutante.

## 🔍 La structure gagnante d'une lettre de motivation

**Accroche (1 paragraphe)** : Commencez par quelque chose d'inattendu — une réalisation, une passion, une anecdote révélatrice. Évitez le classique "C'est avec un grand intérêt que..."

**Pourquoi cette entreprise ?** (1 paragraphe) : Montrez que vous connaissez l'entreprise — ses valeurs, ses projets récents, ce qui vous attire.

**Pourquoi vous ?** (1-2 paragraphes) : Vos 3 compétences clés avec des preuves concrètes et chiffrées.

**Call to action** (1 paragraphe) : Exprimez votre envie de rencontrer le recruteur et votre disponibilité.

## 🔍 Le prompt lettre de motivation parfait

"Tu es un expert en carrière. Rédige une lettre de motivation percutante pour :

**Contexte :**
- Poste : [intitulé du poste]
- Entreprise : [nom et secteur]
- Mes 3 points forts pour ce poste : [listez]
- Une réalisation dont je suis fier(e) : [décrivez]
- Ce qui m'attire dans cette entreprise : [soyez précis]

**Style :**
- Authentique et humain, pas robotique
- Professionnel mais avec de la personnalité
- 250 à 300 mots maximum
- Chaque phrase doit apporter de la valeur

**Évitez absolument :**
- Les clichés ('Je suis motivé(e)', 'Je suis passionné(e)')
- Les répétitions du CV
- Le ton trop formel ou trop familier"

## 💡 Astuce du formateur

Personnalisez TOUJOURS la lettre pour chaque entreprise. Une lettre générique se détecte immédiatement. Demandez à l'IA de chercher des informations sur l'entreprise et d'intégrer des éléments spécifiques à leur actualité.

## ✏️ Exercice pratique

Choisissez une offre d'emploi réelle sur LinkedIn ou un site d'emploi sénégalais. Utilisez le prompt pour créer votre lettre de motivation. Demandez ensuite à l'IA d'évaluer la lettre du point de vue du recruteur.`,
          [
            {
              question: "Quelle est la meilleure façon de commencer une lettre de motivation ?",
              options: [
                { text: "Par la formule classique : 'C'est avec un grand intérêt que je vous soumets ma candidature'", correct: false },
                { text: "Par une accroche originale : réalisation, anecdote ou fait surprenant qui vous caractérise", correct: true },
                { text: "Par la date et l'objet de la lettre uniquement", correct: false },
                { text: "Par une liste de vos diplômes et expériences", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Se préparer à un entretien d'embauche avec l'IA",
          `## 🎯 Introduction

Un entretien d'embauche se gagne avant d'entrer dans la salle. La préparation fait la différence entre le candidat qui bégaie et celui qui répond avec assurance. L'IA peut jouer le rôle du recruteur pour vous entraîner.

## 🔍 Simulation d'entretien avec l'IA

"Tu es un recruteur senior chez [entreprise] pour le poste de [poste]. Tu dois évaluer ma candidature à travers un entretien réaliste et exigeant. Pose-moi les questions une par une. Après chaque réponse, donne-moi un feedback : ce qui était bien, ce qui peut être amélioré. Commence par te présenter et me mettre à l'aise."

## 🔍 Les questions incontournables à préparer

Demandez à l'IA de vous aider à répondre à ces questions universelles :

**1. "Parlez-moi de vous"**
Méthode : 60 secondes max. Passé (formation) → Présent (compétences) → Futur (ambitions).

**2. "Quelles sont vos forces et faiblesses ?"**
Pour les faiblesses : citez une vraie faiblesse que vous travaillez activement à corriger.

**3. "Où vous voyez-vous dans 5 ans ?"**
Alignez vos ambitions avec la trajectoire possible dans l'entreprise.

**4. "Pourquoi quittez-vous votre poste actuel ?"**
Toujours positif : opportunité de croissance, pas de critiques de l'employeur actuel.

**5. "Avez-vous des questions ?"**
TOUJOURS préparer 3-5 questions intelligentes sur l'entreprise.

## 🔍 La méthode STAR pour les questions comportementales

"Décrivez une situation où vous avez géré un conflit" → Utilisez STAR :
- **S**ituation : contexte
- **T**âche : votre rôle
- **A**ction : ce que vous avez fait
- **R**ésultat : l'impact chiffré

Demandez à l'IA : "Aide-moi à formuler une réponse STAR pour [situation de votre vie]"

## 💡 Astuce du formateur

Enregistrez-vous en vidéo pendant la simulation d'entretien avec l'IA (répondez à voix haute devant votre caméra). Regardez-vous ensuite : posture, contact visuel, clarté de l'élocution.

## ✏️ Exercice pratique

Faites une simulation complète d'entretien avec l'IA pendant 20 minutes. Puis demandez-lui de vous noter sur 10 différents critères (préparation, clarté, exemples concrets, etc.) et d'identifier les 3 axes d'amélioration prioritaires.`,
          [
            {
              question: "Qu'est-ce que la méthode STAR utilisée dans les entretiens ?",
              options: [
                { text: "Star est un acronyme pour les 4 types d'étoiles dans l'univers", correct: false },
                { text: "Situation, Tâche, Action, Résultat — une méthode pour structurer ses réponses aux questions comportementales", correct: true },
                { text: "Une technique pour évaluer les candidats selon 4 critères", correct: false },
                { text: "Un test de personnalité standardisé pour les entretiens", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Optimiser son profil LinkedIn avec l'IA",
          `## 🎯 Introduction

LinkedIn est le premier réseau professionnel mondial avec plus de 900 millions de membres. Un profil optimisé peut attirer des recruteurs, des clients et des partenaires même quand vous ne cherchez pas activement.

## 🔍 Les éléments clés d'un profil LinkedIn optimisé

### Photo de profil
Demandez à l'IA : "Décris-moi la photo de profil LinkedIn idéale pour un(e) [votre métier/secteur] qui veut paraître à la fois professionnel et accessible."

### Titre professionnel (accroche)
❌ "Étudiant à l'UCAD" 
✅ "Futur Développeur Web | Passionné par la tech africaine | Open to opportunities"

Prompt : "Crée 5 variantes de titre LinkedIn accrocheur pour mon profil. Je suis [votre situation]. Mon objectif : [ce que vous cherchez]."

### Résumé "À propos"
"Rédige mon résumé LinkedIn en 150 mots. Je suis [situation]. Mes compétences : [listez]. Ma valeur unique : [votre différence]. Mon objectif professionnel : [objectif]. Format : paragraphe narratif à la première personne, authentique et professionnel."

### Section Expériences
Pour chaque poste, transformez les descriptions vagues en résultats concrets :
❌ "Gestion des réseaux sociaux"
✅ "Développé la présence social media de l'entreprise : +150% d'abonnés en 6 mois, taux d'engagement de 8%"

Prompt : "Transforme ces descriptions d'expérience [colle tes descriptions] en bullet points avec des verbes d'action et des résultats chiffrés."

## 💡 Stratégie de contenu LinkedIn

"Crée pour moi un plan de contenu LinkedIn sur 1 mois : 12 posts sur [votre domaine d'expertise]. Pour chaque post : sujet, format (texte/image/carrousel), hook d'accroche, message principal."

## ✏️ Exercice pratique

Si vous n'avez pas de profil LinkedIn, créez-en un maintenant. Utilisez l'IA pour optimiser chaque section : titre, résumé, expériences. Connectez-vous avec 10 professionnels de votre secteur au Sénégal cette semaine.`,
          [
            {
              question: "Quel est le problème avec ce titre LinkedIn : 'Étudiant à l'UCAD' ?",
              options: [
                { text: "Il est trop long", correct: false },
                { text: "Il ne communique aucune valeur, compétence ou ambition professionnelle", correct: true },
                { text: "Il ne faut jamais mentionner son université sur LinkedIn", correct: false },
                { text: "Il devrait être écrit en anglais uniquement", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Trouver des opportunités d'emploi avec l'IA",
          `## 🎯 Introduction

Trouver un emploi est une compétence en soi. L'IA peut vous aider à identifier les meilleures opportunités, à les prioriser et à optimiser votre candidature pour maximiser vos chances.

## 🔍 Stratégie de recherche d'emploi assistée par l'IA

### 1. Définir votre cible

"Aide-moi à définir ma stratégie de recherche d'emploi. Mon profil : [formation, compétences, expériences]. Mes contraintes : [localisation, salaire minimum, type de contrat]. Mes objectifs : [secteur, type de poste, évolution souhaitée]. Propose-moi 5 types de postes qui correspondent à mon profil et 3 secteurs prioritaires à cibler."

### 2. Analyser une offre d'emploi

"Analyse cette offre d'emploi [colle l'offre] :
1. Les compétences obligatoires vs souhaitées
2. Ce que l'entreprise recherche vraiment entre les lignes
3. Le salaire estimé pour ce type de poste au Sénégal
4. Les questions d'entretien probables basées sur cette offre
5. Ma compatibilité avec cette offre selon mon profil [décrivez votre profil]"

### 3. Réseautage stratégique

"Je cherche un poste de [poste] dans le secteur [secteur] au Sénégal. Aide-moi à :
1. Identifier les entreprises qui recrutent ce type de profil
2. Rédiger un message de prise de contact LinkedIn personnalisé
3. Préparer ma pitch de 30 secondes pour les événements professionnels"

## 💼 Ressources de recherche d'emploi au Sénégal

**Plateformes à utiliser :**
- LinkedIn (profil optimisé = candidatures qui arrivent à vous !)
- Emploi.sn, Africarh.com
- Les groupes Facebook sectoriels
- Les sites des entreprises cibles directement

## ✏️ Exercice pratique

Identifiez 10 entreprises qui pourraient vous recruter au Sénégal. Pour 3 d'entre elles, trouvez un contact LinkedIn et rédigez avec l'IA un message de prise de contact personnalisé et professionnel.`,
          [
            {
              question: "Quelle est la meilleure stratégie pour utiliser LinkedIn dans une recherche d'emploi ?",
              options: [
                { text: "Envoyer le même message générique à 100 recruteurs en même temps", correct: false },
                { text: "Optimiser son profil pour être trouvé, puis personnaliser les contacts et candidatures", correct: true },
                { text: "Attendre que les recruteurs vous contactent sans rien faire de proactif", correct: false },
                { text: "Payer LinkedIn Premium avant de commencer à chercher", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Rédiger des emails de candidature parfaits",
          `## 🎯 Introduction

Un email de candidature bien rédigé peut faire toute la différence, surtout pour les candidatures spontanées. L'IA peut vous aider à rédiger des emails qui obtiennent des réponses.

## 🔍 L'email de candidature structuré

**Objet :** [Prénom Nom] — Candidature [Poste] — [Référence si disponible]

**Corps de l'email :**

"Madame, Monsieur,

[Phrase d'accroche personnalisée mentionnant quelque chose de spécifique sur l'entreprise]

Fort(e) de [X années d'expérience / ma formation en X], je vous soumets ma candidature au poste de [poste]. 

[2-3 lignes sur votre valeur ajoutée spécifique pour CE poste]

Vous trouverez en pièce jointe mon CV. Je serais disponible pour un entretien à votre convenance.

Cordialement,
[Nom]
[Téléphone] | [LinkedIn] | [Email]"

## 🔍 Prompt pour email de candidature

"Rédige un email de candidature pour le poste de [poste] à [entreprise]. Mon profil : [décrivez]. Ce que j'ai trouvé d'intéressant sur cette entreprise : [précisez]. Ton : professionnel et enthousiaste. Longueur : 150 mots maximum. L'email doit donner envie d'ouvrir le CV joint."

## 🔍 Email de suivi (relance)

Si vous n'avez pas de réponse après 2 semaines :

"Rédige un email de relance poli et professionnel. Je postule depuis 2 semaines sans réponse. Je ne veux pas paraître désespéré(e) mais montrer mon intérêt sincère. Ton : chaleureux et professionnel. 80 mots maximum."

## 💡 Astuce du formateur

Personnalisez TOUJOURS l'objet de l'email et la première phrase. Les recruteurs reçoivent des dizaines d'emails par jour — se démarquer dès l'objet est crucial.

## ✏️ Exercice pratique

Trouvez une offre d'emploi sur LinkedIn ou Emploi.sn. Rédigez un email de candidature avec l'IA, puis demandez-lui de l'évaluer du point de vue du recruteur et de le noter sur 10.`,
          [
            {
              question: "Quel est le format idéal pour l'objet d'un email de candidature ?",
              options: [
                { text: "Juste 'Candidature' sans autre précision", correct: false },
                { text: "[Prénom Nom] — Candidature [Poste] — [Référence si disponible]", correct: true },
                { text: "Un objet accrocheur et créatif sans mentionner le poste", correct: false },
                { text: "Aucun objet — laisser vide pour intriguer le recruteur", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Projet : votre dossier de candidature complet",
          `## 🎯 Projet final — Module 5

Il est temps de créer votre dossier de candidature complet pour un vrai poste qui vous intéresse. Ce projet intègre toutes les compétences du module.

## 📚 Votre mission

### Étape 1 : Choisir votre cible (10 min)
Trouvez une offre d'emploi réelle sur LinkedIn, Emploi.sn ou le site d'une entreprise qui vous intéresse. Choisissez un poste que vous pouvez réellement briguer dans 3 à 12 mois.

### Étape 2 : Analyser l'offre avec l'IA (15 min)
"Analyse cette offre [colle l'offre]. Identifie les 5 compétences les plus importantes, les mots-clés ATS à intégrer dans mon CV, et évalue ma compatibilité avec mon profil actuel [décrivez votre profil]."

### Étape 3 : Créer ou améliorer votre CV (30 min)
Utilisez les prompts du module pour créer un CV optimisé spécifiquement pour cette offre.

### Étape 4 : Rédiger votre lettre de motivation (20 min)
Créez une lettre personnalisée pour cette offre et cette entreprise spécifique.

### Étape 5 : Préparer votre entretien (30 min)
"Quelles sont les 10 questions les plus probables pour un entretien [poste] chez [entreprise] ? Pour chaque question, aide-moi à construire une réponse STAR solide."

### Étape 6 : Optimiser votre profil LinkedIn (20 min)
Mettez à jour votre profil LinkedIn pour qu'il reflète votre candidature pour ce type de poste.

## 💡 Résultat attendu

À la fin de ce projet, vous avez :
- Un CV optimisé ATS
- Une lettre de motivation personnalisée
- 10 réponses préparées pour l'entretien
- Un profil LinkedIn professionnel

**Option bonus** : Envoyez vraiment votre candidature ! Qu'avez-vous à perdre ?

## 🎯 Évaluation par l'IA

"Évalue mon dossier de candidature complet [colle tout] comme si tu étais le DRH de [entreprise]. Note chaque élément et dis-moi ce qui m'aidera à obtenir un entretien."`,
          [
            {
              question: "Pourquoi est-il important d'adapter son CV à chaque offre d'emploi ?",
              options: [
                { text: "Pour impressionner le recruteur par l'effort fourni", correct: false },
                { text: "Pour intégrer les mots-clés ATS spécifiques à l'offre et montrer une correspondance précise avec les besoins de l'entreprise", correct: true },
                { text: "Parce que les recruteurs ont accès à tous les CV que vous avez envoyés", correct: false },
                { text: "Il ne faut pas adapter — un seul CV suffit pour toutes les candidatures", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 6 : IA pour les entrepreneurs
    ══════════════════════════════════════════ */
    {
      title: "Module 6 : L'IA pour les Entrepreneurs",
      lessons: [

        lesson(
          "Générer des idées de business avec l'IA",
          `## 🎯 Introduction

Trouver une idée de business viable est souvent le premier obstacle pour un entrepreneur. L'IA est un outil de brainstorming extraordinaire qui peut générer des dizaines d'idées adaptées à votre contexte et vos ressources.

## 🔍 Prompt de génération d'idées

"Tu es un expert en entrepreneuriat africain avec 20 ans d'expérience. Je veux lancer une activité au Sénégal. Mon profil :
- Budget disponible : [montant en FCFA]
- Compétences : [listez]
- Temps disponible : [heures/semaine]
- Localisation : [ville/quartier]
- Réseau disponible : [décrivez]

Génère 20 idées de business réalistes et rentables adaptées à mon profil. Pour chaque idée :
- Nom et description (1 ligne)
- Investissement de départ estimé
- Revenu mensuel potentiel en 6 mois
- Niveau de difficulté (1-5)
- Pourquoi ça marche au Sénégal"

## 🔍 Valider une idée de business

"Je veux lancer [idée de business]. Aide-moi à la valider avec cette analyse :
1. **Problème résolu** : Quel problème concret résout ce business ?
2. **Marché cible** : Qui exactement sont les clients (âge, revenus, localisation) ?
3. **Concurrence** : Qui fait déjà ça au Sénégal ? Quelle est ma différence ?
4. **Modèle économique** : Comment je gagne de l'argent exactement ?
5. **Risques principaux** : Quels sont les 3 risques majeurs ?
6. **Verdict** : Est-ce une bonne idée ? Pourquoi ?"

## 💼 Exemples d'idées validées par l'IA pour le Sénégal

- **Cours particuliers à domicile assistés par IA** (budget initial : 50 000 FCFA)
- **Service de rédaction de CV et lettres de motivation** (budget : 0 FCFA)
- **Boutique de vente en ligne sur Instagram** (budget : 100 000 FCFA)
- **Freelance en création de contenu social media** (budget : 0 FCFA)
- **Formation en outils bureautiques pour PME** (budget : 0 FCFA)

## ✏️ Exercice pratique

Générez 20 idées avec l'IA selon votre profil. Sélectionnez votre Top 3. Pour chacune, faites une analyse de validation complète. À la fin, choisissez l'idée qui a le meilleur rapport risque/opportunité.`,
          [
            {
              question: "Quelle est la première étape pour valider une idée de business ?",
              options: [
                { text: "Investir immédiatement tout son budget dans l'idée", correct: false },
                { text: "Identifier clairement quel problème concret l'idée résout et pour qui", correct: true },
                { text: "Créer une société et ouvrir un compte bancaire professionnel", correct: false },
                { text: "Copier exactement ce que fait un concurrent qui réussit", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Créer un business plan avec l'IA",
          `## 🎯 Introduction

Un business plan est le document de référence de votre entreprise. Il décrit votre vision, votre stratégie et vos projections financières. L'IA peut créer un business plan professionnel en quelques heures au lieu de plusieurs semaines.

## 🔍 Le prompt business plan complet

"Tu es un consultant en création d'entreprise. Crée un business plan complet pour mon projet :

**Le projet :**
- Nom : [nom de l'entreprise]
- Secteur : [secteur d'activité]
- Description : [description de l'activité]
- Localisation : [ville/pays]

**Mes ressources :**
- Capital disponible : [montant]
- Associés : [seul ou avec qui]
- Compétences disponibles : [listez]

**Structure du business plan attendue :**
1. Résumé exécutif (1 page)
2. Présentation du porteur de projet
3. Description du produit/service
4. Analyse du marché (concurrents, opportunités, menaces)
5. Stratégie commerciale et marketing
6. Organisation et ressources humaines
7. Prévisions financières (3 ans)
8. Plan d'action (6 premiers mois)
9. Conclusion et demande de financement (si applicable)"

## 🔍 Les projections financières avec l'IA

"Crée des projections financières réalistes sur 12 mois pour mon business [description]. Inclus :
- Chiffre d'affaires mensuel estimé (pessimiste, réaliste, optimiste)
- Charges fixes et variables
- Seuil de rentabilité
- Cash-flow mensuel
- Investissement nécessaire"

## 💡 Astuce du formateur

Un bon business plan est concis et réaliste. Les investisseurs et banquiers se méfient des projections trop optimistes. Demandez à l'IA de jouer le rôle d'un investisseur sceptique et de critiquer votre business plan.

## ✏️ Exercice pratique

Créez un mini business plan (2-3 pages) pour l'idée que vous avez choisie dans la leçon précédente. Demandez ensuite à l'IA de jouer le rôle d'un investisseur qui doit décider d'investir ou non dans votre projet.`,
          [
            {
              question: "Pourquoi les investisseurs se méfient-ils des projections financières trop optimistes ?",
              options: [
                { text: "Parce qu'ils préfèrent investir dans des projets qui ne font pas de profit", correct: false },
                { text: "Parce que des projections irréalistes indiquent un manque de rigueur et de connaissance du marché", correct: true },
                { text: "Parce que la loi interdit les projections financières positives", correct: false },
                { text: "Parce que les banques ne prêtent qu'aux entreprises déficitaires", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Étudier son marché et analyser la concurrence",
          `## 🎯 Introduction

Connaître son marché et ses concurrents est fondamental pour une stratégie gagnante. L'IA peut analyser votre marché, identifier les opportunités et vous aider à vous différencier.

## 🔍 Analyse de marché avec l'IA

"Réalise une analyse de marché complète pour [type de business] au Sénégal :
1. **Taille du marché** : Combien de clients potentiels ? Quel chiffre d'affaires total estimé ?
2. **Tendances** : Comment ce marché évolue-t-il (croissance, déclin, transformation) ?
3. **Segments** : Quels sont les différents types de clients et leurs besoins spécifiques ?
4. **Facteurs de succès** : Qu'est-ce qui fait réussir ou échouer dans ce secteur ?
5. **Opportunités** : Quels besoins non satisfaits existent encore ?"

## 🔍 Analyse de la concurrence (Matrice des concurrents)

"Analyse la concurrence pour mon business [description] :
Pour chaque concurrent identifié :
- Nom et description
- Points forts
- Points faibles
- Prix pratiqués
- Segment de marché ciblé
- Ma différence compétitive vs eux

Présente l'analyse dans un tableau comparatif et conclus sur mon positionnement optimal."

## 🔍 Analyse SWOT assistée par l'IA

"Crée une analyse SWOT complète pour mon business :
- **Forces** : Mes avantages concurrentiels
- **Faiblesses** : Mes limites et vulnérabilités
- **Opportunités** : Les facteurs externes favorables
- **Menaces** : Les risques externes

Pour chaque point, propose des actions concrètes pour maximiser les forces/opportunités et minimiser les faiblesses/menaces."

## 💡 Astuce du formateur

Complétez l'analyse de l'IA avec des observations terrain. Allez dans les marchés, parlez aux commerçants, observez les clients réels. L'IA vous donne le cadre, le terrain vous donne la réalité.

## ✏️ Exercice pratique

Réalisez une analyse SWOT complète pour votre idée de business avec l'IA. Puis allez vérifier sur le terrain au moins 3 des conclusions de l'IA en discutant avec des acteurs du secteur.`,
          [
            {
              question: "Que signifie l'acronyme SWOT dans une analyse de business ?",
              options: [
                { text: "Sales, Wholesale, Output, Taxes", correct: false },
                { text: "Forces (Strengths), Faiblesses (Weaknesses), Opportunités (Opportunities), Menaces (Threats)", correct: true },
                { text: "Strategy, Workflow, Operations, Technology", correct: false },
                { text: "Speed, Work, Organization, Talent", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Créer du contenu marketing automatisé",
          `## 🎯 Introduction

Le marketing est ce qui fait la différence entre un bon produit qui reste inconnu et un produit ordinaire qui se vend. L'IA peut créer du contenu marketing professionnel en quelques secondes.

## 🔍 Contenu pour les réseaux sociaux

"Tu es un expert en marketing digital pour PME africaines. Crée pour mon business [description] :
- 10 textes de posts Facebook/Instagram avec emojis
- 5 stories Instagram (texte + description visuelle)
- 3 textes d'annonces pour WhatsApp Business
- 2 posts LinkedIn professionnels

Cible : [décrivez votre audience]. Ton : [professionnel/amical/dynamique]. Objectif : [vendre/informer/engager]"

## 🔍 Campagne email marketing

"Crée une séquence de 5 emails de bienvenue pour les nouveaux clients de mon business [description] :
- Email 1 (J+0) : Email de bienvenue
- Email 2 (J+2) : Présentation des services
- Email 3 (J+5) : Témoignage client et étude de cas
- Email 4 (J+8) : Offre spéciale ou astuce utile
- Email 5 (J+12) : Invitation à laisser un avis

Pour chaque email : objet accrocheur + corps de 150 mots + CTA clair"

## 🔍 Description de produits/services

"Rédige 5 versions de descriptions pour mon service [description], chacune adaptée à un canal différent :
1. Description courte pour SMS (70 caractères)
2. Description pour Instagram (150 mots avec emojis)
3. Description professionnelle pour site web (300 mots)
4. Script de présentation orale en 30 secondes
5. Pitch pour un investisseur en 2 minutes"

## 💡 Astuce du formateur

Utilisez **Canva** (avec son IA intégrée) pour transformer les textes créés par ChatGPT en visuels professionnels. La combinaison ChatGPT (texte) + Canva (design) vous donne un département marketing complet pour presque rien !

## ✏️ Exercice pratique

Créez un plan de contenu pour 1 semaine (7 posts) pour votre business fictif ou réel. Utilisez l'IA pour rédiger tous les textes et créez les visuels avec Canva. Publiez sur vos réseaux sociaux et mesurez l'engagement.`,
          [
            {
              question: "Quelle combinaison d'outils permet de créer un département marketing quasi-complet à faible coût ?",
              options: [
                { text: "Microsoft Word + Excel", correct: false },
                { text: "ChatGPT pour le texte + Canva pour les visuels", correct: true },
                { text: "Google Docs + Gmail", correct: false },
                { text: "WhatsApp + Facebook uniquement", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Automatiser ses tâches administratives",
          `## 🎯 Introduction

L'un des plus grands avantages de l'IA pour les entrepreneurs est l'automatisation des tâches répétitives et chronophages. Voici comment déléguer à l'IA ce qui vous prend inutilement du temps.

## 🔍 Gestion des emails professionnels

"Tu es mon assistant administratif. Rédige une réponse professionnelle à cet email : [colle l'email]. Ton : [professionnel/amical]. L'objectif de ma réponse : [objectif]. Points à absolument mentionner : [points clés]."

**Templates à garder :**
- Réponse à une demande de devis
- Accusé de réception de commande
- Relance d'impayé (courtoise puis ferme)
- Remerciement après réunion

## 🔍 Rédaction de devis et factures

"Crée un modèle de devis professionnel pour mon service [description]. Le devis doit inclure : en-tête entreprise, description détaillée des prestations, prix unitaires et totaux, conditions de paiement, validité du devis, et une formule de politesse finale."

## 🔍 Comptes rendus de réunion

"Transforme ces notes de réunion en compte-rendu professionnel structuré :
[Colle tes notes brutes]
Format souhaité :
- Participants
- Ordre du jour
- Décisions prises
- Actions à mener (responsable + deadline)
- Prochaine réunion"

## 🔍 Réseaux sociaux programmés

"Crée 30 posts pour le mois de [mois] pour mon entreprise [description]. Thèmes à aborder : [listez]. Un post par jour. Format : texte + description de l'image suggérée + heure optimale de publication."

## 💡 Conseil pratique

Créez une "banque de prompts" personnalisée dans un fichier Google Docs ou Notion. Chaque fois que vous trouvez un prompt qui fonctionne bien, sauvegardez-le. Vous aurez rapidement un système complet qui vous fait gagner des heures chaque semaine.

## ✏️ Exercice pratique

Identifiez les 5 tâches administratives qui vous prennent le plus de temps dans votre activité ou vos études. Pour chacune, créez un prompt IA qui peut l'automatiser. Testez-les et estimez le temps gagné par semaine.`,
          [
            {
              question: "Qu'est-ce qu'une 'banque de prompts' et pourquoi est-elle utile ?",
              options: [
                { text: "Un compte bancaire spécial pour payer les abonnements IA", correct: false },
                { text: "Une collection personnalisée de prompts qui fonctionnent bien, sauvegardée pour réutilisation", correct: true },
                { text: "Une application qui génère automatiquement des prompts IA", correct: false },
                { text: "Un service de stockage cloud pour les conversations IA", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Gérer la relation client avec l'IA",
          `## 🎯 Introduction

La relation client est le cœur d'une entreprise prospère. L'IA peut vous aider à offrir un service client exceptionnel, à fidéliser vos clients et à gérer les situations difficiles.

## 🔍 Créer un chatbot client simple

Pour les petits entrepreneurs, une FAQ bien rédigée avec l'IA peut résoudre 80% des questions clients avant qu'elles arrivent.

"Crée une FAQ complète de 20 questions-réponses pour mon business [description]. Inclus les questions sur : prix, délais, modes de paiement, retours/remboursements, contacts, fonctionnement du service. Ton : amical et rassurant."

## 🔍 Gestion des avis clients

**Répondre aux avis positifs :**
"Rédige 5 réponses différentes aux avis positifs de mes clients. Chaque réponse doit : remercier sincèrement, mentionner un détail de l'avis, inviter à revenir. Ton : chaleureux et authentique."

**Gérer un avis négatif :**
"Un client a laissé cet avis négatif [colle l'avis]. Rédige une réponse professionnelle qui : reconnaît le problème sans admettre une faute grave, montre empathie, propose une solution concrète, et transforme cette situation en opportunité de fidélisation."

## 🔍 Programme de fidélisation

"Crée un programme de fidélisation simple pour mon business [description] avec un budget limité. Le programme doit :
- Récompenser les clients fidèles
- Encourager les recommandations
- Être simple à gérer manuellement (pas de logiciel coûteux)
- S'adapter aux habitudes de paiement africaines (Mobile Money)"

## 💡 Astuce du formateur

Répondez à TOUS les avis clients en ligne, positifs comme négatifs. Les futurs clients lisent ces échanges pour évaluer votre sérieux. L'IA peut vous aider à répondre rapidement et professionnellement.

## ✏️ Exercice pratique

Imaginez 5 situations difficiles de relation client (retard de livraison, produit défectueux, client mécontent, demande de remboursement, erreur de votre part). Pour chacune, créez avec l'IA un script de réponse professionnel et empathique.`,
          [
            {
              question: "Pourquoi est-il important de répondre aux avis négatifs en ligne ?",
              options: [
                { text: "Pour se disputer avec le client mécontent publiquement", correct: false },
                { text: "Parce que les futurs clients lisent ces échanges et évaluent votre professionnalisme à votre façon de gérer les problèmes", correct: true },
                { text: "Pour que l'avis négatif soit supprimé automatiquement par la plateforme", correct: false },
                { text: "Il ne faut jamais répondre aux avis négatifs pour éviter d'aggraver la situation", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Projet : lancez votre micro-entreprise avec l'IA",
          `## 🎯 Projet final — Module 6 : Votre Plan de lancement

Ce projet vous guide pas à pas pour créer un plan de lancement complet pour votre micro-entreprise, en utilisant toutes les compétences du module.

## 📚 Livrable du projet : Le Kit de Lancement Entrepreneur

### Document 1 : L'idée validée (1 page)
- Description du business en 200 mots
- Problème résolu et pour qui
- Analyse SWOT simplifiée
- Verdict de viabilité

### Document 2 : Le mini business plan (3-5 pages)
- Résumé exécutif
- Description du service/produit
- Marché cible et concurrence
- Stratégie de lancement
- Projections financières sur 12 mois

### Document 3 : Kit Marketing de lancement
- Texte de présentation (pour WhatsApp)
- 7 posts Instagram de lancement
- Prix et offre de démarrage
- Script de présentation orale (30 secondes)

### Document 4 : Plan d'action 90 jours
Semaine par semaine : quoi faire, comment, dans quel ordre.

## 🎯 Critères de succès

Votre projet est réussi si :
- L'idée est viable et adaptée au contexte sénégalais
- Le business plan est réaliste (projections financières crédibles)
- Le kit marketing est utilisable immédiatement
- Le plan d'action est concret et réalisable

## 💡 Le meilleur conseil

**Lancez maintenant, même imparfaitement.** L'IA vous a donné tous les outils. La seule chose qui manque, c'est l'action. Même un petit lancement test cette semaine vous apprendra plus que 6 mois de planification !

## 🏆 Challenge

Lancez votre première vente dans les 30 jours qui suivent. Partagez votre résultat dans la communauté Maodo Numérique !`,
          [
            {
              question: "Selon la philosophie entrepreneuriale de ce module, quelle est la clé du succès ?",
              options: [
                { text: "Attendre d'avoir le plan parfait avant de démarrer", correct: false },
                { text: "Lancer immédiatement, même imparfaitement, et apprendre en faisant", correct: true },
                { text: "Trouver des investisseurs avant de commencer quoi que ce soit", correct: false },
                { text: "Copier exactement le modèle d'une entreprise qui réussit", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 7 : IA pour les développeurs
    ══════════════════════════════════════════ */
    {
      title: "Module 7 : L'IA pour les Développeurs",
      lessons: [

        lesson(
          "Écrire du code avec l'IA",
          `## 🎯 Introduction

L'IA a révolutionné le développement logiciel. Des études montrent que les développeurs qui utilisent l'IA écrivent du code **55% plus rapidement** et avec moins de bugs. Dans cette leçon, vous allez apprendre à utiliser l'IA comme partenaire de codage.

## 🔍 Générer du code à partir d'une description

"Tu es un développeur expert en [langage/framework]. Écris le code pour :
[Description précise de ce que vous voulez]

Contraintes techniques :
- Langage : [Python/JavaScript/etc.]
- Framework : [si applicable]
- Base de données : [si applicable]
- Niveau de complexité : [simple/intermédiaire/avancé]

Le code doit être :
- Propre et bien commenté
- Suivre les bonnes pratiques de [langage]
- Inclure la gestion des erreurs
- Être prêt pour la production"

## 🔍 Exemples concrets

**API REST simple :**
"Écris une API REST en Node.js/Express avec deux endpoints : POST /users pour créer un utilisateur et GET /users/:id pour récupérer un utilisateur par ID. Utilise une base de données en mémoire simple (objet JavaScript). Inclus la validation des données et la gestion des erreurs."

**Script d'automatisation Python :**
"Écris un script Python qui lit un fichier Excel avec des données clients, envoie un email personnalisé à chaque client en utilisant smtplib, et génère un rapport CSV des emails envoyés avec succès."

## 🔍 Expliquer du code existant

"Explique ce code ligne par ligne en français simple. Identifie ce qu'il fait, comment il le fait, et les éventuels problèmes potentiels :
[Colle ton code]"

## 💡 GitHub Copilot — l'outil IA intégré à votre éditeur

GitHub Copilot (gratuit pour les étudiants !) s'intègre dans VS Code et complète votre code en temps réel pendant que vous tapez. C'est comme avoir un senior développeur qui code avec vous !

## ✏️ Exercice pratique

Demandez à ChatGPT de créer un programme dans le langage de votre choix qui : prend une liste de noms comme input, les trie alphabétiquement, et affiche un tableau formaté avec le rang de chaque nom. Testez le code et demandez-lui de le modifier pour ajouter une fonctionnalité.`,
          [
            {
              question: "Selon les études, de combien l'IA améliore-t-elle la vitesse de codage des développeurs ?",
              options: [
                { text: "10% plus rapide", correct: false },
                { text: "200% plus rapide", correct: false },
                { text: "55% plus rapide", correct: true },
                { text: "Aucune amélioration mesurée", correct: false },
              ],
            },
            {
              question: "GitHub Copilot est gratuit pour quels utilisateurs ?",
              options: [
                { text: "Seulement pour les entreprises Fortune 500", correct: false },
                { text: "Pour les étudiants avec une adresse email universitaire vérifiée", correct: true },
                { text: "Pour tout le monde sans restriction", correct: false },
                { text: "Il n'existe pas de version gratuite de GitHub Copilot", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Corriger des bugs avec l'IA",
          `## 🎯 Introduction

Le débogage représente souvent 40% du temps d'un développeur. L'IA peut vous aider à identifier et corriger les bugs beaucoup plus rapidement.

## 🔍 Le prompt de débogage parfait

"Tu es un développeur senior expert en [langage]. Ce code produit l'erreur suivante : [message d'erreur exact].

Voici le code complet :
[colle le code]

Identifie :
1. La cause exacte de l'erreur
2. La ligne problématique
3. La correction à apporter
4. Comment éviter cette erreur à l'avenir
5. D'autres problèmes potentiels dans ce code"

## 🔍 Analyse de code sans erreur visible

"Analyse ce code et identifie les problèmes potentiels :
[colle le code]

Cherche :
- Bugs potentiels (edge cases non gérés)
- Problèmes de performance
- Failles de sécurité
- Code mort ou inutile
- Violations des bonnes pratiques

Pour chaque problème : description + impact + correction recommandée"

## 💡 La technique de débogage par explication

Une technique puissante : expliquez votre code à l'IA comme si elle était un débutant. Souvent, en expliquant le problème, vous trouvez vous-même la solution (c'est le principe du "canard en caoutchouc").

"Je vais t'expliquer ce que mon code est censé faire, étape par étape. Après chaque explication, dis-moi si la logique est correcte..."

## 🔍 Erreurs courantes et leur correction

Demandez à l'IA : "Quelles sont les 10 erreurs de débutant les plus courantes en [langage] et comment les éviter ?"

## ✏️ Exercice pratique

Prenez un code que vous avez écrit ou trouvé en ligne et qui contient une erreur intentionnelle. Demandez à l'IA de trouver et corriger l'erreur. Ensuite, demandez-lui d'identifier d'autres améliorations possibles dans le code.`,
          [
            {
              question: "Quelle est la technique du 'canard en caoutchouc' en programmation ?",
              options: [
                { text: "Utiliser un canard comme mascotte pour motiver l'équipe de développement", correct: false },
                { text: "Expliquer son code à voix haute (à un canard, à l'IA, ou à quelqu'un d'autre) pour trouver soi-même les bugs en expliquant", correct: true },
                { text: "Tester le code dans un environnement de bain d'eau", correct: false },
                { text: "Une bibliothèque Python spécialisée dans le débogage", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Comprendre et documenter du code",
          `## 🎯 Introduction

La documentation est la partie du développement que les développeurs font le moins volontiers mais qui est pourtant cruciale pour la maintenance et la collaboration. L'IA peut automatiser cette tâche fastidieuse.

## 🔍 Faire expliquer du code inconnu

"Analyse ce code [colle le code] et explique-moi :
1. Ce que ce code fait globalement (1-2 phrases)
2. Chaque fonction/méthode avec son rôle précis
3. Les paramètres d'entrée et les valeurs de sortie
4. Les dépendances externes utilisées
5. Comment utiliser ce code avec un exemple concret
6. Les limitations ou cas particuliers à connaître"

## 🔍 Générer de la documentation automatique

**Pour une fonction Python :**
"Génère un docstring complet au format Google/NumPy pour cette fonction :
[colle ta fonction]"

**Pour un fichier README :**
"Génère un fichier README.md complet et professionnel pour ce projet :
[Description du projet]
[Technologies utilisées]
[Structure des fichiers]

Le README doit inclure : Description, Installation, Usage, Configuration, Contribution, Licence."

**Pour des commentaires dans le code :**
"Ajoute des commentaires clairs et utiles à ce code. Les commentaires doivent expliquer le 'pourquoi', pas le 'quoi' (que le code montre déjà) :
[colle ton code]"

## 💡 Astuce du formateur

La règle d'or de la documentation : commentez le **pourquoi** et non le **quoi**. Le code lui-même montre ce qu'il fait — les commentaires doivent expliquer pourquoi vous avez fait ce choix.

## ✏️ Exercice pratique

Prenez un projet de code que vous avez écrit sans documentation. Demandez à l'IA de générer : les docstrings pour chaque fonction, un README professionnel et des commentaires inline pertinents.`,
          [
            {
              question: "Qu'est-ce que la règle d'or de la documentation de code ?",
              options: [
                { text: "Commenter chaque ligne de code pour qu'un débutant comprenne", correct: false },
                { text: "Ne jamais écrire de commentaires car le code doit être auto-documenté", correct: false },
                { text: "Commenter le 'pourquoi' des décisions, pas le 'quoi' (que le code montre déjà)", correct: true },
                { text: "Écrire la documentation uniquement en anglais pour l'internationalisation", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "L'IA comme pair-programmeur",
          `## 🎯 Introduction

La programmation en binôme (pair programming) est une technique où deux développeurs travaillent ensemble sur le même code. L'IA peut jouer le rôle du deuxième développeur, disponible 24h/24.

## 🔍 Session de pair programming avec l'IA

"Tu es mon pair-programmeur senior. Nous allons développer [description du projet] ensemble. Je vais te décrire ce que je veux faire, et toi tu vas :
1. Questionner mes choix architecturaux avant de coder
2. Proposer la meilleure approche
3. Écrire le code avec moi
4. M'expliquer chaque décision importante
5. M'alerter si je fais une erreur
Commençons. Voici ma première tâche : [décrivez]"

## 🔍 Revue de code (Code Review)

"Fais une revue de code comme si tu étais un développeur senior chez une grande entreprise tech :
[colle ton code]

Évalue sur ces critères :
- Lisibilité et maintenabilité
- Performance et efficacité
- Sécurité
- Conformité aux bonnes pratiques de [langage]
- Testabilité
- Gestion des erreurs

Note chaque critère de 1 à 10 et liste les améliorations prioritaires."

## 🔍 Architecture et design patterns

"Je dois construire [description du système]. Quelle architecture recommandes-tu ? Explique :
1. L'architecture choisie et pourquoi
2. Les design patterns applicables
3. La structure des fichiers et dossiers
4. Les technologies recommandées
5. Les pièges à éviter"

## 💡 Méthode TDD avec l'IA

Le Test-Driven Development (TDD) : écrire les tests avant le code.
"Je veux créer une fonction [description]. Écris d'abord 5 tests unitaires qui définissent le comportement attendu. Ensuite nous écrirons le code pour passer ces tests."

## ✏️ Exercice pratique

Choisissez un mini-projet (calculatrice, gestionnaire de contacts, convertisseur de devises). Développez-le en pair programming avec l'IA sur 1 heure. L'IA questionne vos choix et vous guide à chaque étape.`,
          [
            {
              question: "Qu'est-ce que le Test-Driven Development (TDD) ?",
              options: [
                { text: "Tester le code uniquement après que les utilisateurs ont signalé des bugs", correct: false },
                { text: "Écrire les tests unitaires AVANT d'écrire le code de production", correct: true },
                { text: "Un type de test automatisé qui s'exécute en production", correct: false },
                { text: "Un logiciel qui génère automatiquement tous les tests", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Sécurité et bonnes pratiques avec l'IA",
          `## 🎯 Introduction

La sécurité est souvent négligée par les développeurs débutants. L'IA peut vous aider à identifier les vulnérabilités de votre code avant qu'elles ne soient exploitées.

## 🔍 Audit de sécurité avec l'IA

"Fais un audit de sécurité complet de ce code [colle le code]. Identifie :
1. Les injections SQL possibles
2. Les failles XSS (Cross-Site Scripting)
3. Les problèmes d'authentification et d'autorisation
4. Les données sensibles non protégées
5. Les dépendances vulnérables
6. Les mauvaises pratiques de stockage des mots de passe
Pour chaque vulnérabilité : description + impact + correction"

## 🔍 Les 10 vulnérabilités OWASP Top 10

Demandez à l'IA : "Explique le OWASP Top 10 avec des exemples de code vulnérable et sécurisé pour chaque catégorie en [langage]. Commence par les plus critiques."

## 🔍 Bonnes pratiques par défaut

"Crée un template de démarrage pour un projet [type de projet] en [langage/framework] qui intègre dès le départ les bonnes pratiques de sécurité :
- Validation des entrées
- Gestion sécurisée des mots de passe
- Protection contre les injections
- Configuration sécurisée par défaut
- Gestion des erreurs sans exposer les détails"

## 💡 Astuce du formateur

Ne faites JAMAIS confiance aux données venant de l'extérieur (formulaires, APIs, fichiers). Toujours valider et nettoyer les entrées. Demandez à l'IA de vous montrer les attaques courantes sur ce type de données.

## ✏️ Exercice pratique

Soumettez un de vos projets existants à l'IA pour un audit de sécurité. Corrigez les 3 vulnérabilités les plus critiques identifiées et demandez à l'IA de vérifier vos corrections.`,
          [
            {
              question: "Qu'est-ce que l'OWASP Top 10 ?",
              options: [
                { text: "Les 10 meilleurs langages de programmation de l'année", correct: false },
                { text: "Une liste des 10 vulnérabilités de sécurité web les plus critiques et répandues", correct: true },
                { text: "Les 10 meilleures bibliothèques JavaScript recommandées", correct: false },
                { text: "Un classement des 10 plus grands frameworks web", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Optimiser les performances de son code",
          `## 🎯 Introduction

Un code lent peut ruiner l'expérience utilisateur. L'IA peut analyser votre code et proposer des optimisations concrètes pour le rendre plus rapide et plus efficace.

## 🔍 Analyse des performances

"Analyse les performances de ce code [colle le code] :
1. Identifie les goulots d'étranglement (parties lentes)
2. Calcule la complexité algorithmique (O notation)
3. Propose des optimisations avec leur impact estimé
4. Écris une version optimisée du code
5. Explique le trade-off entre lisibilité et performance"

## 🔍 Optimisation des requêtes base de données

"Ces requêtes SQL [colle les requêtes] sont lentes. Analyse-les et :
1. Identifie le problème de performance
2. Propose les index appropriés
3. Réécris les requêtes pour les optimiser
4. Explique pourquoi la version optimisée est plus rapide"

## 🔍 Algorithmes alternatifs

"J'utilise actuellement cet algorithme [description] qui est O(n²). Propose des algorithmes plus efficaces pour le même problème avec leur complexité et leur code en [langage]."

## 💡 Principe de Pareto en optimisation

80% des problèmes de performance viennent de 20% du code. Demandez à l'IA de vous aider à identifier ce 20% critique avant d'optimiser partout.

## ✏️ Exercice pratique

Prenez une fonction qui traite une liste de 1000+ éléments. Mesurez son temps d'exécution. Demandez à l'IA de l'optimiser. Mesurez à nouveau et comparez les résultats.`,
          [
            {
              question: "Que signifie O(n²) dans l'analyse de complexité algorithmique ?",
              options: [
                { text: "L'algorithme utilise exactement n² mégaoctets de mémoire", correct: false },
                { text: "Le temps d'exécution croît de manière quadratique avec la taille des données d'entrée", correct: true },
                { text: "L'algorithme fait toujours exactement n multiplié par n opérations", correct: false },
                { text: "La qualité du code est notée n sur une échelle de n²", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Projet : créez une application web avec l'IA",
          `## 🎯 Projet final — Module 7

Dans ce projet, vous allez créer une application web complète en utilisant l'IA comme pair-programmeur. Objectif : avoir une app fonctionnelle à la fin de la session.

## 📚 L'application à créer

**Gestionnaire de finances personnelles simple**

Fonctionnalités :
1. Ajouter des dépenses et revenus avec catégorie et description
2. Afficher le solde courant
3. Lister toutes les transactions
4. Filtrer par catégorie
5. Exporter en CSV

Technologies suggérées : HTML + CSS + JavaScript (débutant) ou React + Node.js (avancé)

## 📚 Processus de développement avec l'IA

**Phase 1 : Architecture (15 min)**
"Tu es mon architecte. Explique-moi la structure que tu recommandes pour cette app [description], avec les fichiers à créer et leur rôle."

**Phase 2 : Frontend (30 min)**
"Crée le HTML/CSS de l'interface utilisateur avec : un formulaire d'ajout de transaction, un tableau d'affichage des transactions, et un résumé des totaux. Design : simple, professionnel, responsive."

**Phase 3 : Logique (30 min)**
"Crée le JavaScript pour gérer les transactions : ajouter, supprimer, filtrer, et calculer les totaux. Utilise localStorage pour sauvegarder les données."

**Phase 4 : Tests et débogage (15 min)**
"Teste ce code, identifie les edge cases non gérés et propose les corrections."

**Phase 5 : Améliorations (15 min)**
"Quelles 3 améliorations prioritaires rendraient cette app plus utile et professionnelle ?"

## 💡 Partage votre création

Mettez votre application en ligne gratuitement sur GitHub Pages ou Netlify (l'IA peut vous guider dans ce processus). Partagez le lien dans la communauté !`,
          [
            {
              question: "Quelle est la première étape recommandée avant de coder une application ?",
              options: [
                { text: "Commencer à coder immédiatement le code le plus complex", correct: false },
                { text: "Définir l'architecture et la structure des fichiers avec l'aide de l'IA", correct: true },
                { text: "Chercher des applications similaires à copier directement", correct: false },
                { text: "Acheter tous les outils de développement professionnels", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 8 : IA pour les créateurs de contenu
    ══════════════════════════════════════════ */
    {
      title: "Module 8 : L'IA pour les Créateurs de Contenu",
      lessons: [

        lesson(
          "Rédiger des articles de blog professionnels",
          `## 🎯 Introduction

Un blog bien géré peut devenir une source de revenus passive et positionner son auteur comme expert dans son domaine. L'IA peut multiplier par 5 votre productivité éditoriale.

## 🔍 Le processus de création d'article avec l'IA

### Étape 1 : Idée et angle
"Génère 20 idées d'articles de blog sur [thématique] qui résolvent des problèmes concrets pour mon audience cible : [description de l'audience]. Pour chaque idée : titre accrocheur + pourquoi ça intéresse cette audience + potentiel SEO."

### Étape 2 : Plan détaillé
"Crée le plan détaillé d'un article sur [sujet] :
- Introduction accrocheuse avec stat ou question
- 5-7 sections avec leurs sous-points
- Exemples à inclure pour chaque section
- Conclusion avec call-to-action
- Idées d'images/infographies"

### Étape 3 : Rédaction de l'article
"Rédige un article de blog de 800 mots sur [sujet] basé sur ce plan [colle le plan]. Style : [informel/professionnel]. Ton : [expert qui vulgarise/narratif/pratique]. Audience : [décrivez]. Inclus des exemples concrets du contexte africain."

### Étape 4 : Optimisation SEO
"Optimise cet article pour le SEO : identifie les mots-clés principaux et secondaires à utiliser, propose une méta-description de 160 caractères, suggère un titre H1 optimisé, et identifie les liens internes et externes à ajouter."

## 💡 Astuce : le style editorial unique

Ne publiez pas les articles de l'IA tels quels — ajoutez votre voix unique. Demandez à l'IA de créer le squelette et les faits, puis apportez vos anecdotes personnelles, votre expertise locale et votre point de vue authentique.

## ✏️ Exercice pratique

Créez un article de blog complet de 600 mots sur un sujet que vous maîtrisez. Utilisez l'IA pour la structure et le contenu de base, puis personnalisez avec votre expérience personnelle. Publiez sur Medium ou un blog gratuit.`,
          [
            {
              question: "Comment ajouter une valeur unique à un article généré par l'IA ?",
              options: [
                { text: "Publier l'article exactement tel que l'IA l'a rédigé", correct: false },
                { text: "Ajouter sa voix personnelle, ses anecdotes et son expertise locale après la génération IA", correct: true },
                { text: "Traduire l'article dans une autre langue", correct: false },
                { text: "Changer uniquement le titre et les images", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Créer du contenu viral pour les réseaux sociaux",
          `## 🎯 Introduction

Sur les réseaux sociaux, les 3 premières secondes sont décisives. L'IA peut vous aider à créer des accroches irrésistibles et du contenu optimisé pour chaque plateforme.

## 🔍 Les hooks (accroches) qui fonctionnent

"Génère 20 hooks irrésistibles pour un post [thématique] sur [réseau social]. Les hooks doivent créer de la curiosité, du suspense ou promettre une valeur immédiate. Cible : [audience]."

**Patterns d'accroches qui fonctionnent :**
- La statistique surprenante : "95% des étudiants font cette erreur..."
- La contradiction : "Ce que votre professeur ne vous dit pas sur..."
- La promesse spécifique : "En 5 minutes, vous saurez..."
- La question provocatrice : "Êtes-vous vraiment prêt pour le marché du travail ?"
- La liste numérotée : "7 erreurs qui coûtent cher aux entrepreneurs africains"

## 🔍 Format de contenu par réseau

**Instagram (carrousel)**
"Crée un carrousel Instagram de 7 slides sur [sujet]. Slide 1 : titre accrocheur. Slides 2-6 : une idée clé par slide avec texte court et description du visuel. Slide 7 : call-to-action et invitation à s'abonner."

**TikTok/Reels (script)**
"Écris un script pour une vidéo TikTok de 60 secondes sur [sujet]. Format : accroche (3 sec) + développement en 3 points (15 sec chacun) + conclusion avec CTA (12 sec). Inclus les transitions et les suggestions de texte à l'écran."

**LinkedIn (post expert)**
"Rédige un post LinkedIn de type 'leçon apprise' sur [expérience ou insight]. Format : accroche percutante + histoire personnelle de 3 paragraphes + 3 enseignements + question pour engager."

## 💡 Le calendrier éditorial optimisé

"Crée un calendrier éditorial pour [réseau social] sur 30 jours. Thématique : [votre niche]. Mix de contenu : 40% éducatif, 30% inspirant, 20% divertissant, 10% promotionnel. Inclus pour chaque post : jour, format, sujet, accroche."

## ✏️ Exercice pratique

Choisissez votre réseau social principal. Créez 7 posts pour une semaine complète avec l'IA. Publiez-les et mesurez les métriques (vues, likes, partages, commentaires). Analysez ce qui a le mieux fonctionné.`,
          [
            {
              question: "Qu'est-ce qu'un 'hook' dans le contexte des réseaux sociaux ?",
              options: [
                { text: "Un hashtag populaire sur Instagram", correct: false },
                { text: "Une accroche initiale conçue pour captiver l'attention dans les premières secondes", correct: true },
                { text: "Un outil de gestion des réseaux sociaux", correct: false },
                { text: "Un type de publicité payante sur les réseaux sociaux", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Écrire des scripts pour YouTube et TikTok",
          `## 🎯 Introduction

La création vidéo est l'un des formats de contenu les plus engageants. Un script bien écrit est la fondation d'une bonne vidéo. L'IA peut créer des scripts professionnels et engageants rapidement.

## 🔍 Structure d'un script YouTube efficace

**AIDA** : Attention → Intérêt → Désir → Action

"Rédige un script YouTube de [durée] minutes sur [sujet]. Structure :
1. **Hook (0-15 sec)** : Question ou fait choquant pour capter immédiatement
2. **Présentation (15-30 sec)** : Ce que le spectateur va apprendre
3. **Développement (X min)** : Contenu principal avec exemples concrets
4. **Transition** : Annonce du prochain point important
5. **Conclusion (30 sec)** : Résumé + Call-to-action (like, abonnement, commentaire)

Style : conversationnel comme si je parlais à un ami. Audience : [description]. Ton : [enthousiaste/professionnel/éducatif]"

## 🔍 Script TikTok (format court)

"Script TikTok de 60 secondes sur [sujet] :
- 0-3 sec : Accroche visuelle + phrase choc
- 4-45 sec : 3 points clés (15 sec chacun), chaque point commence par une transition forte
- 46-60 sec : Conclusion + CTA
Format : [dialogue naturel] + [description de ce qu'on voit à l'écran] + [texte overlay suggéré]"

## 🔍 Optimisation de la durée

- TikTok : 15-60 secondes pour le maximum d'engagement
- YouTube Shorts : 60 secondes
- YouTube standard : 8-15 minutes (temps optimal pour la monétisation)
- Instagram Reels : 30-90 secondes

## 💡 Astuce du formateur

La règle des 3 secondes : votre vidéo doit immédiatement montrer de la valeur dans les 3 premières secondes. Testez votre accroche sur des amis avant de filmer toute la vidéo.

## ✏️ Exercice pratique

Créez un script pour une vidéo de 3 minutes sur un sujet que vous maîtrisez. Enregistrez-vous en suivant le script. Regardez-vous et identifiez 3 points d'amélioration pour la prochaine vidéo.`,
          [
            {
              question: "Que signifie AIDA dans la structure d'un contenu vidéo ?",
              options: [
                { text: "L'Analyse, Interprétation, Description, Application", correct: false },
                { text: "Attention, Intérêt, Désir, Action — les 4 étapes pour captiver et convaincre un spectateur", correct: true },
                { text: "Auteur, Idée, Développement, Adaptation", correct: false },
                { text: "Un acronyme de la plateforme vidéo africaine AIDA", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "SEO et optimisation de contenu avec l'IA",
          `## 🎯 Introduction

Le SEO (Search Engine Optimization) vous permet d'être trouvé gratuitement sur Google. L'IA peut analyser votre contenu et l'optimiser pour attirer plus de visiteurs organiques.

## 🔍 Recherche de mots-clés avec l'IA

"Tu es un expert SEO. Pour mon blog sur [thématique] ciblant un public [description] en Afrique francophone, génère :
1. 20 mots-clés principaux avec leur volume de recherche estimé
2. 50 mots-clés secondaires long-tail (expressions de 3-5 mots)
3. Les questions que se posent mes lecteurs (pour featured snippets)
4. Les sujets peu couverts par la concurrence (opportunités SEO)"

## 🔍 Optimiser un article existant

"Optimise cet article [colle l'article] pour le mot-clé principal : [mot-clé]. 
Identifie :
1. La densité de mots-clés actuelle et l'idéale
2. Les mots-clés sémantiquement liés à intégrer
3. Les améliorations de structure (H1, H2, H3)
4. La méta-description optimale (160 caractères)
5. Les balises alt d'images suggérées
6. L'ajout de maillage interne recommandé"

## 🔍 Créer du contenu SEO-optimisé

"Rédige un article de 1000 mots optimisé SEO pour le mot-clé : [mot-clé]. Intègre naturellement ce mot-clé dans le titre, l'intro, 2-3 sous-titres et la conclusion. Ajoute 5 mots-clés sémantiquement liés. Structure claire avec H2 et H3."

## 💡 Astuce du formateur

Utilisez **Google Search Console** (gratuit) pour voir quels mots-clés amènent déjà du trafic sur votre site. Donnez ces données à l'IA pour qu'elle vous aide à optimiser le contenu existant.

## ✏️ Exercice pratique

Prenez un article que vous avez déjà publié. Demandez à l'IA de l'auditer SEO et de vous donner un score + les 5 améliorations prioritaires. Appliquez ces améliorations et observez l'évolution du trafic sur 30 jours.`,
          [
            {
              question: "Qu'est-ce que le SEO ?",
              options: [
                { text: "Un réseau social professionnel concurrent de LinkedIn", correct: false },
                { text: "Search Engine Optimization — l'optimisation pour être mieux référencé dans les moteurs de recherche", correct: true },
                { text: "Un outil payant de Google pour la publicité en ligne", correct: false },
                { text: "Une technique de codage pour accélérer les sites web", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Construire une stratégie de contenu complète",
          `## 🎯 Introduction

Une stratégie de contenu cohérente transforme un créateur occasionnel en une vraie marque. L'IA peut vous aider à concevoir et exécuter une stratégie de contenu professionnelle.

## 🔍 Définir votre niche et positionnement

"Aide-moi à définir ma niche de contenu. Mon profil : [vos compétences, passions, expériences]. Mon audience cible souhaitée : [décrivez]. Mes concurrents actuels : [listez].

Recommande-moi :
1. Une niche spécifique qui me différencie
2. Mon positionnement unique (ce que j'apporte que les autres n'ont pas)
3. Les 3 piliers de contenu sur lesquels me concentrer
4. Les formats de contenu les plus adaptés à cette niche"

## 🔍 Créer votre persona d'audience

"Crée 3 personas détaillés de mon audience idéale pour un créateur de contenu sur [thématique] en Afrique francophone. Pour chaque persona : prénom fictif, âge, profession, revenus, problèmes principaux, canaux préférés, type de contenu consommé, comment mon contenu les aide."

## 🔍 Plan de contenu sur 3 mois

"Crée un plan de contenu stratégique sur 3 mois pour :
- [Réseau social 1] : [fréquence] posts/semaine
- [Réseau social 2] : [fréquence] posts/semaine
- Blog : [fréquence] articles/mois

Objectifs : [liste vos objectifs — abonnés, engagement, revenus]
Thèmes par mois : [suggérez ou demandez à l'IA]
Mix de contenu : éducatif/inspirant/divertissant/promotionnel"

## 💡 Astuce du formateur

La cohérence bat la perfection. Publier régulièrement (même imparfaitement) est plus efficace que publier rarement (mais parfaitement). Créez un système durable que vous pouvez maintenir sur 6 mois.

## ✏️ Exercice pratique

Définissez votre niche, créez vos 3 personas d'audience et élaborez un plan de contenu sur 30 jours. Préparez 7 posts en avance pour avoir du contenu prêt à publier même les jours chargés.`,
          [
            {
              question: "Qu'est-ce qu'un persona d'audience ?",
              options: [
                { text: "Un compte fictif créé pour augmenter les abonnés d'une page", correct: false },
                { text: "Une description détaillée d'un client/lecteur idéal type pour guider la stratégie de contenu", correct: true },
                { text: "Un masque virtuel utilisé dans les vidéos pour rester anonyme", correct: false },
                { text: "Un outil payant de gestion des réseaux sociaux", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Monétiser son contenu avec l'aide de l'IA",
          `## 🎯 Introduction

Créer du contenu, c'est bien. Gagner de l'argent avec, c'est mieux. L'IA peut vous aider à identifier les meilleures stratégies de monétisation adaptées à votre profil et à votre audience africaine.

## 🔍 Les modèles de monétisation du créateur de contenu

### 1. Vente de formations en ligne
"Aide-moi à créer une formation en ligne sur [sujet]. Je suis expert en [domaine]. Mon audience est [description]. Propose :
- Un titre vendeur
- Un programme de 10 modules
- Un prix adapté au marché africain
- La plateforme de vente recommandée
- La stratégie de lancement"

### 2. Consulting et coaching
"Crée une offre de coaching/consulting sur [expertise] ciblant [audience]. Inclus : description de l'offre, durée, prix recommandé, ce que le client obtient, et comment me différencier."

### 3. Contenu sponsorisé
"Rédige un media kit professionnel pour mes réseaux sociaux. Mes statistiques : [followers, engagement rate]. Mon audience : [description]. Mes créneaux de contenu : [thématiques]. Format : document professionnel d'une page."

### 4. Produits digitaux
"Génère 10 idées de produits digitaux que je pourrais créer et vendre sur [thématique]. Pour chaque idée : description, prix suggéré, temps de création estimé, potentiel de revenus."

## 💡 Astuce du formateur

Commencez par monétiser votre expertise existante avant de créer du nouveau contenu. Si vous savez quelque chose que d'autres veulent apprendre, vous avez déjà un produit à vendre !

## ✏️ Exercice pratique

Identifiez votre expertise principale. Créez une offre de consulting ou un produit digital simple (e-book, template, mini-formation). Utilisez l'IA pour créer la description commerciale et le prix. Faites une première vente test cette semaine.`,
          [
            {
              question: "Quelle est la première recommandation pour monétiser son contenu ?",
              options: [
                { text: "Attendre d'avoir 100 000 abonnés avant de penser à la monétisation", correct: false },
                { text: "Monétiser son expertise existante avant de créer du nouveau contenu", correct: true },
                { text: "Acheter de la publicité pour augmenter sa visibilité rapidement", correct: false },
                { text: "Copier le modèle économique des grands YouTubeurs américains", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Projet : votre calendrier éditorial pour 1 mois",
          `## 🎯 Projet final — Module 8

Ce projet vous permet de créer un système de création de contenu complet et opérationnel pour un mois entier.

## 📚 Votre livrable : Le Pack Créateur Complet

### Partie 1 : Stratégie (30 min)
- Niche définie et positionnement unique
- 3 personas d'audience
- Piliers de contenu
- Objectifs du mois (abonnés, engagement, revenus)

### Partie 2 : Calendrier éditorial (30 min)
Utilisez ce prompt : "Crée un calendrier éditorial pour [réseau social] sur 30 jours. Niche : [votre niche]. Audience : [description]. Objectif : [objectif]. Format : tableau avec date, format du post, sujet, accroche, hashtags, heure de publication."

### Partie 3 : Batch de contenu (2 heures)
Créez 10 posts complets (texte + description visuelle) prêts à publier :
- 4 posts éducatifs
- 3 posts inspirants
- 2 posts divertissants
- 1 post promotionnel

### Partie 4 : Système de mesure
"Crée un tableau de bord simple pour suivre mes performances sur [réseau social] : métriques à suivre, fréquence de mesure, objectifs à 30/60/90 jours."

## 💡 Conseil de mise en oeuvre

Programmez tous vos posts en avance avec **Buffer** ou **Later** (gratuits en version basique). Consacrez 2-3 heures chaque week-end à préparer le contenu de la semaine suivante. L'IA réduit ce temps à 1 heure.

## 🏆 Challenge de la semaine

Publiez vos 7 premiers posts cette semaine. Engagez-vous avec vos followers dans les commentaires. Mesurez l'engagement et ajustez votre stratégie selon les retours.`,
          [
            {
              question: "Quelle est la stratégie de création de contenu la plus efficace pour la durabilité ?",
              options: [
                { text: "Créer du contenu uniquement quand on est inspiré", correct: false },
                { text: "Planifier et batcher le contenu à l'avance (2-3 heures par semaine)", correct: true },
                { text: "Publier 10 posts par jour pour maximiser la visibilité", correct: false },
                { text: "Attendre que les abonnés demandent du contenu avant de créer", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 9 : IA pour le design
    ══════════════════════════════════════════ */
    {
      title: "Module 9 : L'IA pour le Design et la Création Visuelle",
      lessons: [

        lesson(
          "Introduction au design par IA",
          `## 🎯 Introduction

Le design graphique est l'une des compétences les plus demandées et les mieux payées. Grâce à l'IA, vous n'avez plus besoin d'années de formation pour créer des visuels professionnels.

## 📚 Les outils de design par IA

| Outil | Spécialité | Accès |
|-------|-----------|-------|
| **Canva IA** | Design général, réseaux sociaux | Gratuit + Pro |
| **Adobe Firefly** | Images IA, retouche | Gratuit limité |
| **Midjourney** | Images artistiques | Payant |
| **DALL·E 3** | Images précises | Via Bing (gratuit) |
| **Gamma.app** | Présentations | Gratuit limité |
| **LogoAI** | Logos automatiques | Freemium |
| **Remove.bg** | Suppression d'arrière-plan | Gratuit limité |

## 🔍 Les principes fondamentaux du design

Même avec l'IA, comprendre ces principes améliore vos résultats :

**1. La hiérarchie visuelle** : Ce qui est important est plus grand, plus contrasté, en première position.

**2. L'alignement** : Chaque élément doit être aligné avec quelque chose d'autre.

**3. La règle des tiers** : Placez les éléments importants sur les intersections d'une grille 3×3.

**4. Les couleurs** : Maximum 3 couleurs par design. La roue chromatique IA peut vous aider.

**5. L'espace blanc** : Ce qui n'est pas là est aussi important que ce qui est là.

## 🔍 Briefer l'IA pour un bon design

La qualité du résultat dépend de la qualité du brief. Apprenez à décrire précisément ce que vous voulez : style, couleurs, ambiance, usage, format.

## ✏️ Exercice pratique

Créez un compte Canva (gratuit). Explorez la fonctionnalité "Magic Studio" (IA intégrée). Créez un flyer pour un événement fictif en utilisant uniquement l'IA de Canva. Notez ce qui est facile et ce qui est difficile.`,
          [
            {
              question: "Quel outil de design par IA est entièrement gratuit pour créer des images de qualité professionnelle ?",
              options: [
                { text: "Midjourney", correct: false },
                { text: "Adobe Photoshop", correct: false },
                { text: "Bing Image Creator (DALL·E 3)", correct: true },
                { text: "Figma Pro", correct: false },
              ],
            },
            {
              question: "Qu'est-ce que la règle des tiers en design ?",
              options: [
                { text: "Utiliser exactement 3 couleurs dans chaque design", correct: false },
                { text: "Diviser l'image en une grille 3x3 et placer les éléments importants sur les intersections", correct: true },
                { text: "Réduire chaque texte à 3 mots maximum", correct: false },
                { text: "Créer 3 versions de chaque design avant de choisir", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Créer des affiches et visuels marketing",
          `## 🎯 Introduction

Une affiche percutante peut faire toute la différence pour un événement, une promotion ou une campagne. L'IA démocratise la création graphique professionnelle.

## 🔍 La méthode en 3 étapes

### Étape 1 : Briefer ChatGPT
"Décris-moi l'image parfaite pour une affiche de [objectif]. Public cible : [description]. Style visuel souhaité : [moderne/traditionnel/coloré/minimaliste]. Couleurs dominantes : [couleurs]. Message principal : [message]. Ce prompt sera utilisé pour générer l'image avec Midjourney/DALL·E."

### Étape 2 : Générer l'image de fond
Utilisez le prompt généré sur Bing Image Creator ou Midjourney.

### Étape 3 : Finaliser dans Canva
Importez votre image dans Canva, ajoutez le texte, le logo et les détails avec le éditeur Canva.

## 🔍 Prompts d'affiches qui fonctionnent

**Affiche événement culturel africain :**
"Affiche moderne pour un festival de musique africaine à Dakar. Ambiance festive, couleurs chaudes (orange, rouge, or), silhouettes de danseurs, palmiers stylisés, fond de coucher de soleil. Style : graphique contemporain avec touches africaines traditionnelles. Haute qualité, format portrait A3."

**Affiche commerciale :**
"Visuel publicitaire pour une boutique de vêtements africains en ligne. Produit central : boubou coloré sur mannequin. Background : fond blanc épuré avec touches de couleur. Style : luxueux et moderne. Format : carré pour Instagram."

## 💡 Canva Magic Design

Dans Canva, utilisez "Magic Design" : décrivez simplement ce que vous voulez et Canva génère automatiquement plusieurs options de design complets que vous pouvez personnaliser.

## ✏️ Exercice pratique

Créez une affiche pour un événement réel ou fictif de votre quartier/ville. Utilisez la méthode en 3 étapes. Partagez votre création et demandez des feedbacks.`,
          [
            {
              question: "Quelle est la méthode recommandée pour créer une affiche professionnelle avec l'IA ?",
              options: [
                { text: "Utiliser uniquement l'IA sans aucune intervention manuelle", correct: false },
                { text: "Briefer ChatGPT pour le prompt, générer l'image avec DALL·E/Midjourney, finaliser dans Canva", correct: true },
                { text: "Copier exactement une affiche existante et changer le texte", correct: false },
                { text: "Demander à un graphiste professionnel de tout faire", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Créer des logos et identités visuelles",
          `## 🎯 Introduction

Un logo professionnel coûtait autrefois des centaines de milliers de FCFA chez un graphiste. Avec l'IA, vous pouvez créer une identité visuelle complète pour votre entreprise ou projet.

## 🔍 Ce qu'une bonne identité visuelle comprend

1. **Logo** : Icône + nom de l'entreprise
2. **Palette de couleurs** : 2-3 couleurs primaires + 1-2 couleurs secondaires
3. **Typographie** : 2 polices (une pour les titres, une pour le corps)
4. **Moodboard** : L'ambiance générale de la marque
5. **Templates** : Carte de visite, en-tête email, signature email

## 🔍 Créer votre palette de couleurs avec l'IA

"Crée une identité de couleurs pour mon entreprise [description]. Valeurs de marque : [listez — ex: fiabilité, innovation, proximité]. Cible : [description de l'audience]. Secteur : [secteur]. Recommande :
- 1 couleur principale (avec code hex)
- 2 couleurs complémentaires (avec codes hex)
- La psychologie de chaque couleur choisie"

## 🔍 Outils de création de logo par IA

**Looka.com** : Génère des logos professionnels basés sur vos préférences. Gratuit pour voir les options, payant pour télécharger.

**Canva Logo Maker** : Générateur de logos dans Canva, personnalisable.

**Brandmark.io** : IA qui génère une identité visuelle complète.

**Adobe Firefly** : Pour les éléments graphiques créatifs.

## 💡 Brief pour un logo

"Je veux un logo pour [nom de l'entreprise], une [type d'entreprise] qui [ce que vous faites]. Valeurs : [3 mots qui vous décrivent]. Style souhaité : [moderne/classique/playful/minimaliste]. Couleurs souhaitées : [couleurs ou ambiance]. Le logo doit fonctionner en couleur ET en noir et blanc."

## ✏️ Exercice pratique

Créez l'identité visuelle complète pour votre projet ou micro-entreprise : logo, palette de couleurs, typographie. Utilisez Canva pour créer une carte de visite simple avec votre nouvelle identité.`,
          [
            {
              question: "Quels éléments composent une identité visuelle complète ?",
              options: [
                { text: "Seulement le logo et le nom de l'entreprise", correct: false },
                { text: "Logo, palette de couleurs, typographie, moodboard et templates", correct: true },
                { text: "Les couleurs préférées du dirigeant de l'entreprise", correct: false },
                { text: "Une photo du fondateur et un slogan", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Concevoir des présentations percutantes",
          `## 🎯 Introduction

Une présentation mémorable peut vous faire gagner un client, convaincre des investisseurs ou impressionner un jury. L'IA transforme la création de présentations.

## 🔍 Gamma.app — la révolution des présentations

Gamma.app est un outil révolutionnaire : vous décrivez en quelques lignes votre présentation, et l'IA génère automatiquement des slides complets, visuellement attractifs, en quelques secondes.

**Comment l'utiliser :**
1. Allez sur gamma.app
2. Cliquez sur "Create new"
3. Choisissez "Generate"
4. Décrivez votre présentation en quelques phrases
5. Choisissez votre style et couleurs
6. L'IA génère 10-15 slides en 30 secondes
7. Modifiez et personnalisez

## 🔍 Les principes d'une présentation efficace

**Règle 10-20-30 de Guy Kawasaki :**
- Maximum **10 slides**
- Maximum **20 minutes**
- Minimum **30 points** de taille de police

**Règle d'or :** 1 idée par slide. Jamais de murs de texte.

## 🔍 Prompt pour créer des slides avec l'IA

"Crée le contenu de 8 slides pour une présentation sur [sujet] devant [audience]. Objectif : [convaincre/informer/vendre]. Pour chaque slide :
- Titre court et percutant
- Message clé (1 phrase)
- Contenu (3 bullet points max)
- Donnée/statistique à mettre en valeur
- Description du visuel suggéré"

## 💡 Astuce du formateur

Commencez votre présentation par la fin : quel est le 1 message que votre audience doit retenir ? Construisez tout autour de ce message central.

## ✏️ Exercice pratique

Créez une présentation de 8 slides sur un sujet de votre choix avec Gamma.app. Présentez-la à voix haute comme si vous étiez devant un vrai public. Filmez-vous et analysez votre présentation.`,
          [
            {
              question: "Quelle est la règle 10-20-30 de Guy Kawasaki pour les présentations ?",
              options: [
                { text: "10 heures de préparation, 20 répétitions, 30 minutes de présentation", correct: false },
                { text: "Maximum 10 slides, 20 minutes de présentation, minimum 30 points de taille de police", correct: true },
                { text: "10 images par slide, 20 slides maximum, 30 secondes par slide", correct: false },
                { text: "10 personnes dans l'audience minimum, 20 questions répondues, 30% de contenu visuel", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Retouche photo et manipulation d'images avec l'IA",
          `## 🎯 Introduction

La retouche photo professionnelle était réservée aux experts Photoshop. L'IA a démocratisé cela — en quelques clics, vous pouvez transformer vos photos.

## 🔍 Les outils de retouche IA gratuits

**Remove.bg** — Suppression d'arrière-plan en 1 clic
**Cleanup.pictures** — Suppression d'objets sur une photo
**Remini** — Amélioration de la qualité photo (idéal pour vieilles photos ou photos floues)
**Adobe Express** — Retouche complète avec IA intégrée
**Canva** — Effets, filtres, suppression d'arrière-plan IA

## 🔍 Adobe Firefly Generative Fill

Adobe Firefly (disponible dans Photoshop et Firefly.adobe.com) permet de :
- **Générer** : Ajouter des éléments dans une photo
- **Supprimer** : Effacer des éléments indésirables
- **Étendre** : Agrandir une image au-delà de ses bords
- **Remplacer** : Changer des éléments de la photo

**Exemple :** Vous avez une photo professionnelle mais l'arrière-plan est encombré. En 30 secondes avec Firefly, vous pouvez le remplacer par un fond de bureau élégant.

## 🔍 Améliorer vos photos pour les réseaux sociaux

**Pour les photos de profil :**
1. Supprimez l'arrière-plan avec Remove.bg
2. Ajoutez un fond professionnel avec Canva
3. Améliorez la qualité avec Remini
4. Ajoutez un cadre ou un effet de marque

## 💡 Éthique de la retouche photo

La retouche est normale pour améliorer la présentation. Mais excessivement modifier une photo pour induire en erreur (fausse publicité, fausse identité) est contraire à l'éthique et souvent illégal.

## ✏️ Exercice pratique

Prenez une photo de vous ou d'un objet avec votre téléphone. Utilisez Remove.bg pour supprimer l'arrière-plan. Puis utilisez Canva pour ajouter un arrière-plan professionnel. Comparez avant/après et partagez votre résultat.`,
          [
            {
              question: "Quel outil en ligne permet de supprimer automatiquement l'arrière-plan d'une photo en 1 clic ?",
              options: [
                { text: "Microsoft Paint", correct: false },
                { text: "Remove.bg", correct: true },
                { text: "Windows Photo Viewer", correct: false },
                { text: "Google Photos uniquement dans la version payante", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Illustrations pédagogiques et infographies",
          `## 🎯 Introduction

Les infographies et illustrations pédagogiques transforment des informations complexes en visuels faciles à comprendre et à partager. Elles génèrent en moyenne 3 fois plus d'engagement que le texte seul.

## 🔍 Créer des infographies avec l'IA

**Canva (recommandé pour débutants)**
1. Ouvrez Canva
2. Cherchez "infographie" dans les templates
3. Demandez à l'IA (Magic Write) de générer le contenu textuel
4. Adaptez le template avec votre contenu

**Prompt pour Canva Magic Write :**
"Génère le contenu textuel pour une infographie sur [sujet]. Format : 5 statistiques clés + 5 points principaux en bullet courts + 1 conclusion choc. Chaque point : titre court + chiffre ou fait marquant."

## 🔍 Les types d'infographies

**Timeline** : Pour l'histoire d'un événement ou processus
**Comparaison** : Pour comparer 2 options ou produits
**Processus** : Pour expliquer des étapes
**Statistiques** : Pour visualiser des données
**Carte** : Pour les données géographiques

## 🔍 Créer des illustrations IA pour cours

"Génère une illustration pédagogique expliquant [concept difficile]. Style : schéma clair et coloré, adapté pour des élèves de [niveau]. Inclure : labels clairs, flèches de processus, code couleur logique. Format : horizontal pour présentation"

## 💡 Vectorize.io

Si vous avez une illustration simple que vous voulez rendre vectorielle (pour pouvoir l'agrandir sans perte de qualité), utilisez Vectorize.io qui convertit automatiquement les images en vecteurs SVG.

## ✏️ Exercice pratique

Choisissez un concept de votre domaine d'études ou de travail qui est difficile à expliquer par des mots. Créez une infographie explicative dans Canva. Montrez-la à quelqu'un qui ne connaît pas le sujet et évaluez si l'infographie aide à la compréhension.`,
          [
            {
              question: "Quel est l'avantage des infographies par rapport au texte seul ?",
              options: [
                { text: "Elles prennent moins de temps à créer qu'un texte", correct: false },
                { text: "Elles génèrent en moyenne 3 fois plus d'engagement et facilitent la compréhension de concepts complexes", correct: true },
                { text: "Elles sont mieux référencées dans Google que les textes", correct: false },
                { text: "Elles ne nécessitent aucune compétence pour être créées", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Projet : votre portfolio créatif complet",
          `## 🎯 Projet final — Module 9

Ce projet vous permet de créer un portfolio créatif complet qui démontre vos nouvelles compétences en design IA. C'est aussi un outil précieux pour trouver des clients ou un emploi.

## 📚 Votre portfolio doit contenir

### 1. Votre identité de marque personnelle
- Logo personnel
- Palette de couleurs
- Typographie choisie

### 2. Collection de créations visuelles (minimum 5)
- 2 affiches (événement, promotion)
- 1 infographie pédagogique
- 1 identité visuelle pour un projet fictif ou réel
- 1 série de posts réseaux sociaux cohérents (3 posts)

### 3. Présentation de votre processus
Pour 2 créations, documentez votre processus :
- Brief initial
- Prompt utilisé
- Résultat brut IA
- Modifications apportées
- Résultat final

## 📚 Mise en ligne du portfolio

**Option gratuite :** Behance.net (plateforme portfolio pour créatifs)
**Option rapide :** Créez un carrousel Instagram "Portfolio"
**Option pro :** Site web simple avec Notion ou Google Sites

## 💡 Comment trouver vos premiers clients design

Avec un portfolio de 5 créations, vous pouvez déjà proposer vos services :
- 10 000 à 50 000 FCFA pour un flyer
- 50 000 à 200 000 FCFA pour une identité visuelle
- 30 000 à 100 000 FCFA pour un kit réseaux sociaux

Commencez par des projets pour des amis ou associations gratuitement pour construire votre portfolio, puis passez aux clients payants.`,
          [
            {
              question: "Pourquoi est-il recommandé de documenter son processus de création dans un portfolio ?",
              options: [
                { text: "Pour montrer que vous avez travaillé longtemps sur chaque projet", correct: false },
                { text: "Pour démontrer votre méthode de travail, rassurer les clients sur votre processus et montrer votre valeur ajoutée", correct: true },
                { text: "C'est obligatoire légalement pour utiliser des outils IA", correct: false },
                { text: "Pour éviter que des concurrents copient vos créations", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 10 : Automatisation avec l'IA
    ══════════════════════════════════════════ */
    {
      title: "Module 10 : Automatisation avec l'IA",
      lessons: [

        lesson(
          "Automatiser la gestion de vos emails",
          `## 🎯 Introduction

La gestion des emails consomme en moyenne 2,5 heures par jour pour un professionnel. L'IA peut automatiser une grande partie de cette tâche.

## 🔍 L'IA dans Gmail avec Gemini

Si vous utilisez Gmail, Gemini est maintenant intégré directement :
- **Résumé** : Résume automatiquement les emails longs
- **Brouillon IA** : Propose des réponses à vos emails
- **Recherche intelligente** : "Trouve l'email où on parlait du contrat de mars"

## 🔍 Créer des templates d'emails avec l'IA

"Crée une bibliothèque de 10 templates d'emails professionnels pour [type d'activité] :
1. Accueil nouveau client
2. Confirmation de commande
3. Relance douce impayé (J+15)
4. Relance ferme impayé (J+30)
5. Réponse à une réclamation
6. Envoi de devis
7. Suivi après réunion
8. Demande de témoignage client
9. Annonce de promotion
10. Email de réengagement (clients inactifs)

Pour chaque template : objet + corps de 150 mots + signature"

## 🔍 Rédiger des emails avec l'IA

"Je dois répondre à cet email [colle l'email]. Ma situation : [contexte]. Ce que je veux communiquer : [votre message]. Rédige une réponse professionnelle et efficace en 100 mots maximum."

## 💡 Règle des 2 minutes d'emails

Pour les emails courts et urgents, traitez-les immédiatement. Pour les emails longs et complexes, utilisez l'IA pour préparer une réponse de qualité en 2 minutes plutôt qu'une réponse approximative en 15 minutes.

## ✏️ Exercice pratique

Créez votre bibliothèque personnelle de 5 templates d'emails pour vos situations les plus fréquentes. Sauvegardez-les dans un Google Doc ou dans les brouillons Gmail. Mesurez le temps gagné par email sur 1 semaine.`,
          [
            {
              question: "En moyenne, combien de temps par jour la gestion des emails consomme-t-elle pour un professionnel ?",
              options: [
                { text: "30 minutes", correct: false },
                { text: "2,5 heures", correct: true },
                { text: "5 heures", correct: false },
                { text: "15 minutes", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Générer des documents et rapports automatiquement",
          `## 🎯 Introduction

Rapports, comptes rendus, contrats, procédures — ces documents prennent des heures à rédiger. L'IA peut les générer en quelques minutes tout en maintenant une qualité professionnelle.

## 🔍 Générer un rapport professionnel

"Génère un rapport professionnel sur [sujet/thème] pour [destinataire/audience]. 

Contexte : [décrivez la situation]
Données disponibles : [listez vos données]
Objectif du rapport : [informer/analyser/recommander]

Structure souhaitée :
1. Résumé exécutif (1/2 page)
2. Contexte et problématique
3. Analyse et résultats
4. Recommandations (liste numérotée)
5. Plan d'action
6. Conclusion

Ton : professionnel et factuel. Longueur : [X pages]."

## 🔍 Automatiser les rapports récurrents

Si vous devez produire le même type de rapport régulièrement (rapport mensuel, rapport de stage, compte rendu hebdomadaire), créez un **template de prompt** que vous réutilisez en changeant uniquement les données.

Exemple de template : "Génère mon rapport d'activité hebdomadaire. Cette semaine : [activités]. Objectifs atteints : [résultats]. Difficultés rencontrées : [problèmes]. Prochaines semaines : [prévisions]. Format : rapport de 1 page, sections clairement délimitées."

## 🔍 Procès-verbaux et comptes rendus

"Transforme ces notes de réunion brutes en procès-verbal officiel :
[Colle tes notes]
Date : [date] - Participants : [liste] - Ordre du jour : [points]
Format : PV officiel avec numérotation des décisions, actions avec responsables et délais."

## 💡 Astuce du formateur

Toujours vérifier les chiffres et faits importants générés par l'IA dans les rapports. L'IA peut interpoler ou inventer des données — votre responsabilité professionnelle est engagée dans les rapports officiels.

## ✏️ Exercice pratique

Rédigez un rapport de stage fictif (ou réel) de 2 pages avec l'aide de l'IA. Notez le temps que ça vous a pris comparé à la méthode traditionnelle.`,
          [
            {
              question: "Quelle précaution est indispensable quand l'IA génère un rapport professionnel ?",
              options: [
                { text: "Ajouter le nom de l'IA en tant que co-auteur du rapport", correct: false },
                { text: "Vérifier tous les chiffres et faits importants car l'IA peut inventer des données", correct: true },
                { text: "Utiliser uniquement des données générées par l'IA, pas les données réelles", correct: false },
                { text: "Soumettre le rapport sans le lire car l'IA ne fait pas d'erreurs", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "L'IA et les tableurs : Excel et Google Sheets",
          `## 🎯 Introduction

Excel et Google Sheets sont les outils les plus utilisés dans le monde professionnel. L'IA peut vous aider à créer des formules complexes, analyser des données et automatiser des tâches répétitives.

## 🔍 Générer des formules Excel avec l'IA

"Je travaille sur Excel/Google Sheets. J'ai besoin d'une formule pour [décrivez ce que vous voulez faire]. Ma structure de données : [décrivez vos colonnes]. Génère la formule et explique comment elle fonctionne."

**Exemples courants :**
- "Calcule la somme de toutes les ventes du mois de janvier dans la colonne B"
- "Trouve automatiquement le prix dans ma liste de produits selon le nom en colonne A"
- "Compte le nombre de commandes avec le statut 'Livré'"

## 🔍 Analyser des données avec l'IA

Si vous avez un tableau de données, vous pouvez demander à ChatGPT ou Claude d'analyser les patterns et tendances.

"Voici mes données de vente des 6 derniers mois [colle le tableau]. Analyse-les et identifie :
1. Les tendances principales
2. Le meilleur mois et le pire mois
3. Les produits les plus vendus
4. Les recommandations pour améliorer les ventes"

## 🔍 Créer des dashboards automatiques

"Crée pour moi un plan de tableau de bord Excel pour suivre les performances de mon activité. Données à suivre : [listez]. Graphiques recommandés : [demandez]. Fréquence de mise à jour : [journalière/hebdomadaire/mensuelle]."

## 💡 Copilot dans Excel (Microsoft 365)

Si vous avez Microsoft 365, **Copilot dans Excel** permet de demander en langage naturel : "Crée un graphique en barres comparant les ventes de ce mois avec le mois précédent" — et Excel le fait automatiquement !

## ✏️ Exercice pratique

Créez un tableau de suivi de vos dépenses du mois dans Google Sheets. Demandez à l'IA de vous aider avec les formules pour : total par catégorie, pourcentage du budget utilisé, et prévision de fin de mois.`,
          [
            {
              question: "Comment l'IA peut-elle aider avec Excel ou Google Sheets ?",
              options: [
                { text: "L'IA ne peut pas aider avec les tableurs car ce sont des logiciels différents", correct: false },
                { text: "Elle peut générer des formules complexes, analyser des données et suggérer des graphiques en langage naturel", correct: true },
                { text: "L'IA peut uniquement créer des tableaux simples avec additions", correct: false },
                { text: "L'IA remplace complètement Excel dans toutes les entreprises", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Automatiser avec Zapier et Make.com",
          `## 🎯 Introduction

L'automatisation sans code permet de connecter vos applications et de créer des workflows automatiques. Zapier et Make.com sont les deux plateformes leaders. L'IA peut vous aider à les maîtriser.

## 🔍 Qu'est-ce que l'automatisation no-code ?

Imaginez que vous recevez un nouveau client sur WhatsApp. Automatiquement :
1. Son contact est ajouté dans votre Google Sheet
2. Un email de bienvenue lui est envoyé
3. Une tâche est créée dans votre gestionnaire de tâches
4. Un message Slack vous alerte

Tout cela **sans aucune intervention manuelle** — c'est l'automatisation no-code.

## 🔍 Zapier vs Make.com

**Zapier :**
- Plus simple à utiliser
- Version gratuite : 5 automatisations (Zaps)
- Plus de 5000 applications connectées

**Make.com (anciennement Integromat) :**
- Plus puissant et flexible
- Version gratuite plus généreuse
- Idéal pour des automatisations complexes

## 🔍 Utiliser l'IA pour créer ses automatisations

"Je veux créer une automatisation qui [décrivez le processus]. Applications utilisées : [listez]. Aide-moi à concevoir cette automatisation sur Zapier/Make :
1. L'événement déclencheur (trigger)
2. Les étapes intermédiaires (actions)
3. La logique conditionnelle si nécessaire
4. Les données à transférer entre chaque étape"

## 💡 5 automatisations utiles pour commencer

1. Nouveau email → Tâche dans Google Tasks
2. Nouveau formulaire → Email de confirmation automatique
3. Nouveau suiveur Instagram → Sauvegardé dans Google Sheet
4. Rappel calendrier → Message WhatsApp automatique
5. Nouvelle commande → Facture générée automatiquement

## ✏️ Exercice pratique

Créez votre premier Zap sur Zapier (gratuit) : chaque fois que vous recevez un email avec un sujet spécifique, une tâche est automatiquement créée dans votre outil de gestion de tâches. Demandez à l'IA de vous guider pas à pas.`,
          [
            {
              question: "Qu'est-ce qu'un 'trigger' dans le contexte de l'automatisation no-code ?",
              options: [
                { text: "Un outil pour tirer des données d'une base de données", correct: false },
                { text: "L'événement déclencheur qui lance l'automatisation (ex: réception d'un email)", correct: true },
                { text: "Le bouton pour déclencher manuellement une automatisation", correct: false },
                { text: "Une erreur qui arrête l'automatisation", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Créer des chatbots personnalisés",
          `## 🎯 Introduction

Un chatbot bien configuré peut répondre automatiquement aux questions fréquentes de vos clients 24h/24. Avec les nouvelles plateformes IA, créer un chatbot ne nécessite plus aucune compétence technique.

## 🔍 Les plateformes de chatbot no-code

**Landbot.io** — Interface visuelle intuitive, connexion avec WhatsApp
**Tidio** — Chatbot pour site web, intégration facile
**ManyChat** — Spécialisé Instagram et Facebook Messenger
**Custom GPTs** (OpenAI) — Créer votre propre version de ChatGPT

## 🔍 Créer un Custom GPT (ChatGPT personnalisé)

Si vous avez ChatGPT Plus, vous pouvez créer votre propre assistant IA personnalisé :

1. Ouvrez ChatGPT → "Explore GPTs" → "Create"
2. Donnez un nom et une description à votre GPT
3. Dans "Instructions" : définissez la personnalité, les règles, les informations spécifiques
4. Uploadez des documents (catalogue produit, FAQ, politique de l'entreprise)
5. Partagez le lien avec vos clients

**Exemple :** Un assistant IA pour votre boutique qui connaît tous vos produits, prix et politiques de retour.

## 🔍 Écrire les instructions d'un chatbot avec l'IA

"Rédige les instructions complètes pour un chatbot IA destiné à [votre business]. Le chatbot doit :
- Personnalité : [description]
- Répondre à ces types de questions : [listez]
- Toujours dire [ce qu'il doit toujours faire]
- Ne jamais faire [restrictions]
- Escalader vers un humain si : [conditions]
Inclus 20 exemples de Q&R pour entraîner le chatbot."

## 💡 Astuce du formateur

Un bon chatbot doit savoir quand il ne sait pas répondre. Programmez toujours une option "Je transfère votre question à notre équipe" pour les cas complexes. Les chatbots qui inventent des réponses font plus de mal que de bien !

## ✏️ Exercice pratique

Créez un Custom GPT gratuit (si vous avez ChatGPT Plus) ou utilisez Tidio gratuitement pour créer un chatbot simple pour un projet fictif. Testez-le avec 10 questions typiques de clients.`,
          [
            {
              question: "Qu'est-ce qu'un Custom GPT dans ChatGPT ?",
              options: [
                { text: "Une version modifiée de ChatGPT qui fonctionne sans internet", correct: false },
                { text: "Un assistant IA personnalisé avec des instructions, une personnalité et des documents spécifiques à votre usage", correct: true },
                { text: "Un outil payant qui accélère les réponses de ChatGPT", correct: false },
                { text: "Un programme qui permet à ChatGPT d'accéder à vos fichiers personnels", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Workflows intelligents pour gagner du temps",
          `## 🎯 Introduction

Un workflow intelligent est un processus optimisé qui combine plusieurs outils et automatisations pour accomplir une tâche complexe avec un minimum d'effort manuel.

## 🔍 Concevoir un workflow avec l'IA

"Aide-moi à créer un workflow complet pour [processus]. Objectif : réduire le temps nécessaire de [temps actuel] à [objectif]. Outils disponibles : [listez]. Contrôle humain requis à ces étapes : [listez]. Propose :
1. Un schéma du workflow en texte
2. Les outils recommandés pour chaque étape
3. Les points d'automatisation possibles
4. Les KPIs pour mesurer l'efficacité"

## 🔍 Exemple : Workflow de création de contenu complet

**Déclencheur :** Lundi matin, 1h de travail
1. ChatGPT génère 10 idées de posts pour la semaine
2. Sélection manuelle de 7 idées (5 min)
3. ChatGPT rédige les 7 textes
4. Canva IA génère les visuels correspondants
5. Buffer programme la publication automatique
6. Vendredi : ChatGPT analyse les métriques et recommande pour la semaine suivante

**Résultat :** 1 semaine de contenu en 1 heure au lieu de 7-8 heures

## 🔍 Workflow de recrutement assisté par IA

1. L'offre d'emploi est rédigée par l'IA
2. Les candidatures reçues sont résumées par l'IA
3. L'IA classe les candidats selon les critères
4. Sélection manuelle des finalistes
5. L'IA prépare les questions d'entretien personnalisées
6. L'IA aide à rédiger la décision finale

## 💡 Règle d'automatisation

Automatisez toujours les tâches **répétitives**, **standardisées** et **à faible valeur ajoutée**. Gardez le contrôle humain sur les décisions **importantes**, **créatives** et **relationnelles**.

## ✏️ Exercice pratique

Identifiez le processus le plus chronophage de votre semaine. Dessinez son workflow actuel. Identifiez 3 étapes automatisables avec l'IA. Créez un workflow amélioré et estimez le temps gagné par semaine.`,
          [
            {
              question: "Quelles tâches devraient idéalement être automatisées avec l'IA ?",
              options: [
                { text: "Toutes les tâches sans exception pour maximiser l'efficacité", correct: false },
                { text: "Les tâches répétitives, standardisées et à faible valeur ajoutée", correct: true },
                { text: "Seulement les tâches techniques de programmation", correct: false },
                { text: "Les décisions stratégiques importantes de l'entreprise", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Projet : automatisez votre journée de travail",
          `## 🎯 Projet final — Module 10

Dans ce projet, vous allez cartographier votre journée type et identifier toutes les opportunités d'automatisation pour gagner du temps.

## 📚 Phase 1 : Audit de votre temps (1 heure)

Pendant une journée, notez toutes vos activités et le temps passé sur chacune. À la fin de la journée, categorisez-les :
- **Haute valeur** : Tâches créatives, décisions, relations
- **Moyenne valeur** : Coordination, suivi, rapports
- **Faible valeur** : Emails répétitifs, saisie de données, recherches basiques

## 📚 Phase 2 : Plan d'automatisation avec l'IA

"Voici mon audit de journée type [colle votre liste]. Identifie toutes les opportunités d'automatisation avec l'IA et les outils no-code. Pour chaque opportunité :
- Tâche actuelle et temps consommé
- Solution d'automatisation recommandée
- Outil(s) à utiliser
- Temps gagné estimé
- Complexité de mise en place (1-5)"

## 📚 Phase 3 : Mise en place des 3 automatisations prioritaires

Sélectionnez les 3 automatisations avec le meilleur rapport valeur/facilité. Mettez-les en place avec l'aide de l'IA (demandez des guides pas à pas).

## 📚 Phase 4 : Mesure et ajustement (après 1 semaine)

Mesurez le temps réellement gagné. Ajustez les automatisations si nécessaire. Identifiez les prochaines automatisations à mettre en place.

## 🎯 Résultat attendu

Après ce projet, vous devriez avoir automatisé au moins 30 minutes de tâches répétitives par jour, soit **2,5 heures par semaine** récupérées pour des activités à plus haute valeur.

## 💡 La vraie liberté

L'automatisation ne remplace pas le travail — elle vous libère du travail à faible valeur pour vous concentrer sur ce qui compte vraiment : la créativité, les relations, la stratégie.`,
          [
            {
              question: "Quel est le vrai objectif de l'automatisation des tâches ?",
              options: [
                { text: "Éliminer complètement le travail humain", correct: false },
                { text: "Libérer du temps des tâches à faible valeur pour se concentrer sur les activités créatives et stratégiques", correct: true },
                { text: "Licencier le maximum d'employés pour réduire les coûts", correct: false },
                { text: "Travailler le moins possible", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 11 : Les limites de l'IA
    ══════════════════════════════════════════ */
    {
      title: "Module 11 : Les Limites et Risques de l'IA",
      lessons: [

        lesson(
          "Les hallucinations : quand l'IA invente",
          `## 🎯 Introduction

L'une des limites les plus importantes de l'IA actuelle est sa tendance à "halluciner" — c'est-à-dire à générer des informations fausses avec une confiance absolue. Comprendre ce phénomène est essentiel pour utiliser l'IA de manière responsable.

## 🔍 Qu'est-ce qu'une hallucination IA ?

Une hallucination se produit quand l'IA génère une information **plausible en apparence mais totalement fausse en réalité**. Elle ne "sait" pas qu'elle invente — elle génère simplement le texte le plus probable selon son entraînement.

## 🔍 Exemples d'hallucinations courantes

**Citations inventées :**
ChatGPT peut inventer des citations attribuées à des personnalités réelles. "Albert Einstein a dit : [citation inventée]"

**Articles scientifiques fictifs :**
L'IA peut citer des articles avec des auteurs, des titres, des revues et des dates — entièrement inventés. Des avocats américains ont eu de sérieux problèmes en citant devant un tribunal des cas judiciaires inventés par ChatGPT !

**Statistiques incorrectes :**
"70% des Sénégalais utilisent les réseaux sociaux" — peut être inventé si ce chiffre n'est pas dans les données d'entraînement.

**Faits historiques erronés :**
Les dates, les noms, les événements peuvent être approximatifs ou incorrects.

## 🔍 Comment se protéger des hallucinations

**1. Vérifiez les informations importantes :**
Toute statistique, citation, fait scientifique ou date historique doit être vérifié sur une source primaire.

**2. Utilisez Perplexity :**
Perplexity cite ses sources en temps réel, ce qui réduit considérablement le risque d'hallucinations.

**3. Demandez à l'IA son niveau de certitude :**
"Es-tu certain de cette information ? Si non, dis-le moi clairement."

**4. Ne faites pas confiance aveuglément :**
L'IA est un outil d'aide, pas une encyclopédie infaillible.

## 💡 Règle d'or

L'IA est excellente pour la structure, le style, la créativité et les idées générales. Elle est peu fiable pour les faits précis, les statistiques spécifiques, les citations exactes et les informations récentes.

## ✏️ Exercice pratique

Demandez à ChatGPT 3 faits précis sur un sujet que vous connaissez bien. Vérifiez chaque fait sur une source fiable. Notez le taux d'erreurs. Cela vous donnera une calibration réaliste de la fiabilité de l'IA.`,
          [
            {
              question: "Qu'est-ce qu'une 'hallucination' dans le contexte de l'IA ?",
              options: [
                { text: "Quand l'IA répond à des questions impossibles", correct: false },
                { text: "Quand l'IA génère des informations fausses mais plausibles avec une confiance absolue", correct: true },
                { text: "Quand l'IA refuse de répondre à une question", correct: false },
                { text: "Quand l'IA génère des images surréalistes", correct: false },
              ],
            },
            {
              question: "Quelle est la règle d'or pour utiliser l'IA de manière fiable ?",
              options: [
                { text: "Faire confiance à toutes les réponses de l'IA car elle a été entraînée sur des données vérifiées", correct: false },
                { text: "Utiliser uniquement les réponses de ChatGPT car c'est le plus fiable", correct: false },
                { text: "Vérifier toute information importante (statistiques, citations, dates) sur des sources primaires", correct: true },
                { text: "Demander toujours la même question 3 fois et prendre la réponse majoritaire", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Les biais algorithmiques et leurs conséquences",
          `## 🎯 Introduction

Les IA apprennent à partir de données humaines — et les données humaines sont pleines de biais. Cette leçon explore comment les biais s'introduisent dans l'IA et pourquoi cela nous concerne directement.

## 🔍 Qu'est-ce qu'un biais algorithmique ?

Un biais algorithmique est une discrimination systématique qu'une IA reproduit et amplifie à partir des données sur lesquelles elle a été entraînée.

## 🔍 Exemples concrets de biais IA

**Biais racial :**
Des systèmes de reconnaissance faciale ont montré des taux d'erreur jusqu'à 34% plus élevés pour les personnes à la peau foncée que pour les personnes à peau claire — car ils avaient été principalement entraînés sur des visages blancs.

**Biais de genre :**
Des IA de recrutement ont été trouvées à désavantager les femmes car elles avaient appris des données historiques de recrutement qui favorisaient les hommes.

**Biais culturel :**
La plupart des grands modèles de langage sont entraînés principalement en anglais, avec une représentation limitée des cultures africaines. Cela signifie que leurs références, exemples et perspectives peuvent être biaisés vers les cultures occidentales.

## 🔍 Impact pour l'Afrique

Les systèmes IA déployés en Afrique ont parfois été conçus sans tenir compte des réalités locales :
- Systèmes de crédit qui discriminent selon la localisation
- Traducteurs qui distordent les langues locales
- Outils médicaux entraînés sur des données non-africaines

## 💡 Comment réagir face aux biais

1. **Questionner** : "D'où vient cette information ? Est-ce représentatif de mon contexte ?"
2. **Comparer** : Utilisez plusieurs outils IA et comparez les réponses
3. **Contextualiser** : Demandez à l'IA d'adapter ses réponses au contexte africain
4. **Signaler** : Si vous détectez un biais, signalez-le aux développeurs

## ✏️ Exercice pratique

Demandez à ChatGPT, Gemini et Claude de décrire "une famille africaine typique". Comparez les réponses. Identifiez les biais présents. Demandez ensuite à chaque IA de corriger ses biais si vous en avez détecté.`,
          [
            {
              question: "Pourquoi les IA de reconnaissance faciale ont-elles souvent des taux d'erreur plus élevés pour les personnes à peau foncée ?",
              options: [
                { text: "Les IA sont programmées pour discriminer délibérément", correct: false },
                { text: "Ces IA ont été entraînées principalement sur des visages à peau claire, créant un biais dans leur apprentissage", correct: true },
                { text: "La reconnaissance faciale ne fonctionne pas sous les tropiques à cause de la lumière", correct: false },
                { text: "C'est un phénomène normal et acceptable dans l'IA", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Risques de désinformation et fake news",
          `## 🎯 Introduction

L'IA peut générer du contenu faux de manière convaincante — photos, vidéos, textes. Cette capacité représente l'un des risques les plus sérieux pour la société. Comment se protéger ?

## 🔍 Les nouvelles formes de désinformation IA

**Deepfakes :**
Des vidéos où le visage et la voix d'une personne réelle sont remplacés par une IA. Vous pouvez "voir" un président dire des choses qu'il n'a jamais dites.

**Articles générés par IA :**
Des milliers d'articles faux peuvent être générés en quelques minutes et publiés sur des faux sites d'information.

**Faux témoignages et photos :**
Des preuves photographiques ou des témoignages entièrement fabriqués.

## 🔍 Comment détecter le contenu IA faux

**Pour les images :**
- Vérifiez les détails incohérents : doigts, textes, arrière-plan flou
- Utilisez des détecteurs IA : Google Images, TinEye (recherche inversée)
- Cherchez des artéfacts : zones pixelisées, lumière incohérente

**Pour les textes :**
- Style trop parfait et sans erreurs
- Pas de sources citées
- Informations non vérifiables
- Date récente sur un site inconnu

**Pour les vidéos :**
- Clignements des yeux anormaux
- Bouche mal synchronisée
- Cheveux ou contours flous
- Éclairage incohérent

## 🔍 Outils de vérification des faits

- **Africa Check** (africacheck.org) — Vérification des faits pour l'Afrique
- **DFRLab** — Désinformation en Afrique
- **Snopes** — Vérification internationale
- **Google Fact Check Tools** — Outil de vérification Google

## 💡 Règle des 3 sources

Avant de partager une information, vérifiez-la sur 3 sources différentes et indépendantes. Si vous ne trouvez que 1 source, ne partagez pas.

## ✏️ Exercice pratique

Cherchez sur internet une information qui vous semble douteuse. Utilisez les outils et méthodes de cette leçon pour vérifier si elle est vraie ou fausse. Partagez votre analyse avec vos proches.`,
          [
            {
              question: "Qu'est-ce qu'un deepfake ?",
              options: [
                { text: "Une technique de programmation très avancée", correct: false },
                { text: "Une vidéo ou image où le visage et/ou la voix d'une personne réelle ont été remplacés par une IA", correct: true },
                { text: "Un faux profil sur les réseaux sociaux", correct: false },
                { text: "Une intelligence artificielle trop profonde dans ses analyses", correct: false },
              ],
            },
            {
              question: "Qu'est-ce que la 'règle des 3 sources' ?",
              options: [
                { text: "Utiliser 3 outils IA différents pour vérifier une information", correct: false },
                { text: "Partager une information uniquement si vous la trouvez sur 3 sources indépendantes et fiables", correct: true },
                { text: "Attendre 3 jours avant de partager n'importe quelle information", correct: false },
                { text: "Traduire chaque information dans 3 langues pour confirmer la traduction", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Sécurité, confidentialité et bonnes pratiques",
          `## 🎯 Introduction

Utiliser l'IA de manière responsable implique de protéger vos données personnelles et celles de vos clients. Cette leçon vous donne les règles essentielles de sécurité.

## 🔍 Ce qu'il ne faut JAMAIS partager avec l'IA

**Données personnelles sensibles :**
- Numéros de carte bancaire ou coordonnées bancaires
- Mots de passe
- Numéros de sécurité sociale ou d'identification nationale
- Données médicales confidentielles
- Photos intimes

**Données professionnelles confidentielles :**
- Secrets commerciaux de votre entreprise
- Contrats et données clients sans autorisation
- Informations sous accord de confidentialité (NDA)
- Données financières non publiques

## 🔍 Comment les IA traitent vos données

**ChatGPT :** Peut utiliser vos conversations pour améliorer ses modèles (sauf si vous désactivez cette option dans les paramètres).

**Claude :** N'utilise pas les conversations des API pour l'entraînement. La version web peut les utiliser.

**Gemini :** Peut traiter les données pour améliorer les services Google.

**Comment désactiver :** Sur ChatGPT → Paramètres → Contrôles de données → Désactiver "Améliorer les modèles pour tout le monde"

## 🔍 Règles de sécurité professionnelle

1. **Anonymisez** les données avant de les donner à l'IA
2. **Vérifiez** la politique de confidentialité de chaque outil
3. **Utilisez** des comptes séparés (perso/pro) pour l'IA
4. **Informez** vos clients si vous utilisez l'IA pour traiter leurs données
5. **Conformez-vous** aux lois de protection des données (RGPD en Europe)

## 💡 La version "Privacy" de certains outils

ChatGPT Enterprise et Claude for Work offrent des garanties de confidentialité renforcées pour les entreprises. Si vous manipulez des données sensibles professionnellement, ces versions sont recommandées.

## ✏️ Exercice pratique

Vérifiez les paramètres de confidentialité de tous les outils IA que vous utilisez. Pour ChatGPT, désactivez la collecte de données si vous ne souhaitez pas contribuer à l'entraînement. Créez une liste personnelle de "données à ne jamais partager avec l'IA".`,
          [
            {
              question: "Quelle action devez-vous faire pour que ChatGPT n'utilise pas vos conversations pour entraîner ses modèles ?",
              options: [
                { text: "Supprimer votre compte ChatGPT", correct: false },
                { text: "Utiliser uniquement le mode incognito de votre navigateur", correct: false },
                { text: "Dans Paramètres → Contrôles de données → Désactiver 'Améliorer les modèles pour tout le monde'", correct: true },
                { text: "Écrire 'NE PAS UTILISER MES DONNÉES' au début de chaque conversation", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Développer son esprit critique face à l'IA",
          `## 🎯 Introduction

L'esprit critique est la compétence la plus importante pour naviguer dans un monde dominé par l'IA. Cette leçon vous donne les outils pour évaluer les réponses de l'IA avec discernement.

## 🔍 Les questions à se poser face à une réponse IA

**1. La source :**
"D'où vient cette information ? Est-ce que l'IA a cité ses sources ?"

**2. La date :**
"Cette information est-elle récente ? Le modèle IA peut avoir des connaissances limitées à une date."

**3. Le contexte :**
"Cette information s'applique-t-elle à mon contexte spécifique (Sénégal, Afrique, mon secteur) ?"

**4. La cohérence :**
"Cette information est-elle cohérente avec ce que je sais déjà ? Avec d'autres sources ?"

**5. L'intérêt :**
"Qui a intérêt à ce que cette information soit diffusée ?"

## 🔍 La méthode de fact-checking SIFT

**S**top : Arrêtez-vous avant de partager ou d'agir
**I**nvestigate the source : Qui a créé cette information ?
**F**ind better coverage : Existe-t-il d'autres sources qui confirment ou infirment ?
**T**race claims : Retrouvez la source originale de l'information

## 🔍 L'IA n'a pas d'opinion — mais vous, si

L'IA peut argumenter pour n'importe quel point de vue. Ce n'est pas parce qu'elle présente un argument de manière convaincante que cet argument est correct. Votre jugement humain reste indispensable.

## 💡 La complémentarité humain-IA

L'IA est excellente pour :
- Traiter rapidement de grandes quantités d'informations
- Générer des options et des idées
- Effectuer des calculs et des analyses

L'humain est irremplaçable pour :
- Le jugement éthique
- La compréhension du contexte culturel
- La créativité authentique
- La responsabilité des décisions

## ✏️ Exercice pratique

Demandez à une IA de défendre deux positions opposées sur un sujet controversé (ex: "l'IA va créer plus d'emplois qu'elle n'en supprime" puis "l'IA va détruire des millions d'emplois"). Analysez comment l'IA argumente les deux positions. Quelle est votre propre position après réflexion ?`,
          [
            {
              question: "Que signifie la méthode SIFT de fact-checking ?",
              options: [
                { text: "Search, Identify, Find, Track — une technique de recherche avancée", correct: false },
                { text: "Stop, Investigate the source, Find better coverage, Trace claims — pour vérifier la fiabilité d'une information", correct: true },
                { text: "Share, Inform, Follow, Trust — pour diffuser les informations vérifiées", correct: false },
                { text: "Save, Index, Filter, Tag — pour organiser ses sources d'information", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 12 : Éthique de l'IA
    ══════════════════════════════════════════ */
    {
      title: "Module 12 : Éthique et Usage Responsable de l'IA",
      lessons: [

        lesson(
          "L'IA et la propriété intellectuelle",
          `## 🎯 Introduction

L'IA soulève des questions juridiques et éthiques complexes sur la propriété intellectuelle. Comprendre ces enjeux vous protège légalement et vous aide à utiliser l'IA de manière responsable.

## 🔍 Les grandes questions

**Les œuvres générées par IA appartiennent-elles à l'utilisateur ?**
C'est encore débattu juridiquement. Dans la plupart des pays, seules les œuvres créées par un humain peuvent être protégées par le droit d'auteur. Une image générée entièrement par IA peut n'être protégée par personne.

**L'IA peut-elle utiliser des œuvres protégées pour s'entraîner ?**
C'est le grand débat actuel. Des artistes, auteurs et musiciens poursuivent en justice des entreprises IA pour avoir utilisé leurs œuvres sans autorisation pour entraîner les modèles.

**Peut-on vendre du contenu généré par IA ?**
En général oui, mais il faut vérifier les conditions d'utilisation de chaque outil. Certains outils comme Midjourney ont des clauses restrictives pour les utilisations commerciales.

## 🔍 Bonnes pratiques

1. **Divulguez** l'utilisation de l'IA quand c'est pertinent (ghostwriting éthique vs non-éthique)
2. **Vérifiez** les conditions d'utilisation de chaque outil IA
3. **Créditez** vos sources d'inspiration, même si l'IA a produit le contenu final
4. **Ne prétendez pas** que du contenu 100% généré par IA est entièrement de votre création dans des contextes où c'est problématique

## 🔍 Dans le contexte africain

Le cadre juridique africain sur l'IA et la propriété intellectuelle est encore en construction. Le Sénégal et d'autres pays CEDEAO développent des législations qui clarifieront ces questions dans les prochaines années.

## 💡 Position pratique

En attendant des lois claires : utilisez l'IA comme outil de travail, ajoutez votre valeur créative et humaine au résultat, et soyez transparent sur votre processus de création quand on vous le demande.

## ✏️ Exercice pratique

Lisez les conditions d'utilisation de ChatGPT, Midjourney et Canva concernant la propriété du contenu généré. Résumez en 3 points clés pour chaque outil.`,
          [
            {
              question: "Qui possède généralement les droits sur une image entièrement générée par IA ?",
              options: [
                { text: "L'entreprise qui a créé l'IA (ex: OpenAI)", correct: false },
                { text: "C'est encore légalement incertain dans la plupart des pays", correct: true },
                { text: "L'utilisateur qui a tapé le prompt possède tous les droits", correct: false },
                { text: "Tout le monde peut l'utiliser librement sans restriction", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "L'IA et le marché du travail en Afrique",
          `## 🎯 Introduction

La question "l'IA va-t-elle supprimer mon emploi ?" est sur toutes les lèvres. Dans cette leçon, nous examinons objectivement les impacts de l'IA sur l'emploi, particulièrement dans le contexte africain.

## 🔍 Emplois à risque vs emplois amplifiés

### Emplois à risque d'automatisation
- Saisie de données
- Traduction basique
- Service client répétitif
- Comptabilité basique
- Rédaction standardisée

### Emplois amplifiés par l'IA
- Médecins (diagnostic + IA = meilleure médecine)
- Enseignants (cours + IA = apprentissage personnalisé)
- Avocats (recherche + IA = conseils plus complets)
- Ingénieurs (code + IA = développement plus rapide)
- Entrepreneurs (idées + IA = exécution amplifiée)

### Nouveaux emplois créés par l'IA
- Prompt Engineer
- Formateur en IA
- Développeur d'applications IA
- Éthicien de l'IA
- Gestionnaire de données

## 🔍 La perspective africaine

L'Afrique a une opportunité unique : elle peut sauter les étapes d'industrialisation traditionnelle et passer directement à l'économie numérique et IA. Mais cela nécessite un investissement massif dans la formation.

**Défi :** 60% des emplois africains actuels risquent d'être automatisables dans les 20 prochaines années selon certaines études.

**Opportunité :** L'Afrique a la population la plus jeune du monde (âge médian : 19 ans). Une jeunesse formée à l'IA peut devenir un avantage compétitif mondial.

## 💡 La stratégie gagnante

La clé n'est pas de résister à l'IA, mais de s'en emparer. Les personnes qui maîtrisent l'IA seront celles qui emploieront les autres, pas celles qui cherchent du travail.

## ✏️ Exercice pratique

Recherchez votre métier actuel ou souhaité sur "Will Robots Take My Job" (willrobotstakemyjob.com). Analysez le niveau d'automatisation prévu. Identifiez les compétences à développer pour rester indispensable.`,
          [
            {
              question: "Quelle est la stratégie recommandée face à l'automatisation par l'IA ?",
              options: [
                { text: "Rejoindre des mouvements pour interdire l'IA", correct: false },
                { text: "Choisir des métiers que l'IA ne peut jamais toucher", correct: false },
                { text: "Maîtriser l'IA pour l'utiliser comme amplificateur de ses propres compétences", correct: true },
                { text: "Attendre que les gouvernements régulent l'IA avant de se former", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "L'IA dans l'éducation : aide ou triche ?",
          `## 🎯 Introduction

L'utilisation de l'IA dans les études soulève des questions fondamentales sur l'apprentissage, l'évaluation et l'intégrité académique. Cette leçon vous aide à naviguer entre l'aide légitime et la triche.

## 🔍 La ligne entre aide et triche

### Utilisation légitime de l'IA ✅
- Résumer un cours pour comprendre plus rapidement
- Expliquer un concept difficile autrement
- Corriger la grammaire d'un texte que vous avez rédigé
- Générer des exercices de révision
- S'entraîner pour un examen

### Zone grise ⚠️
- Reformuler un texte existant pour l'améliorer
- Générer la structure d'un devoir que vous remplissez
- Utiliser l'IA pour trouver des idées puis les développer vous-même

### Triche caractérisée ❌
- Soumettre un devoir entièrement généré par l'IA comme votre travail
- Utiliser l'IA pendant un examen surveillé sans autorisation
- Copier des réponses IA sans les comprendre

## 🔍 Pourquoi éviter la triche ?

**Court terme :** Risque de renvoi ou de sanction académique grave.

**Long terme :** Vous n'aurez pas les compétences que votre diplôme certifie. Face aux difficultés réelles du monde professionnel, vous serez dépassé.

**Vrai apprentissage :** Utiliser l'IA pour comprendre (pas pour remplacer votre réflexion) vous rend plus intelligent. La copier vous rend plus dépendant.

## 🔍 L'avenir de l'évaluation académique

Les institutions académiques s'adaptent. Certaines permettent l'IA en précisant les règles, d'autres interdisent toute utilisation. Les examens de demain seront conçus pour évaluer ce que l'IA ne peut pas faire : esprit critique, créativité, application dans des contextes inédits.

## 💡 Position constructive

Soyez transparent avec vos professeurs sur votre utilisation de l'IA. Posez-leur la question directement. Beaucoup sont ouverts à une discussion constructive sur l'intégration responsable de l'IA.

## ✏️ Exercice pratique

Rédigez votre propre "charte d'utilisation éthique de l'IA pour vos études". 5-10 règles que vous vous imposez pour utiliser l'IA de manière honnête et efficace dans votre parcours académique.`,
          [
            {
              question: "Quelle utilisation de l'IA dans les études est clairement de la triche ?",
              options: [
                { text: "Demander à l'IA d'expliquer un concept difficile du cours", correct: false },
                { text: "Utiliser l'IA pour corriger les fautes d'orthographe d'un texte que vous avez rédigé", correct: false },
                { text: "Soumettre un devoir entièrement généré par l'IA comme votre propre travail", correct: true },
                { text: "Générer des exercices de révision pour préparer un examen", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "L'IA au service du développement africain",
          `## 🎯 Introduction

Malgré ses risques, l'IA représente une opportunité historique pour l'Afrique de résoudre des problèmes anciens avec des outils nouveaux. Cette leçon explore comment l'IA peut contribuer au développement du continent.

## 🔍 Applications de l'IA pour les défis africains

### Santé
- **Diagnostic IA** en zones rurales sans médecins
- **Analyse d'images médicales** (radios, frottis sanguin pour la malaria)
- **Chatbots santé** qui répondent aux questions médicales de base
- **Prédiction d'épidémies** basée sur les données climatiques et de mobilité

### Agriculture
- **Prédiction météorologique** hyper-locale pour les agriculteurs
- **Détection de maladies** des plantes par photo smartphone
- **Optimisation de l'irrigation** basée sur l'humidité du sol
- **Prix du marché en temps réel** pour éviter les intermédiaires

### Éducation
- **Tuteurs IA** en langues locales
- **Contenu adaptatif** selon le niveau de chaque élève
- **Formation à distance** pour les zones rurales
- **Traduction automatique** dans les langues africaines

### Finance inclusive
- **Crédit alternatif** basé sur le comportement mobile
- **Détection de fraude** pour protéger les utilisateurs mobiles
- **Conseiller financier IA** pour les personnes sans accès bancaire

## 🔍 Initiatives africaines d'IA

- **Deep Learning Indaba** : Communauté africaine de chercheurs en IA
- **Masakhane** : IA pour les langues africaines
- **InstaDeep** (Tunisie) : Startup IA africaine de référence mondiale
- **Lelapa AI** (Afrique du Sud) : IA en langues locales africaines

## 💡 Votre rôle

Chaque étudiant ou professionnel africain qui maîtrise l'IA et qui l'applique à des problèmes locaux contribue au développement du continent. Vous n'êtes pas simplement consommateur de cette technologie — vous pouvez en être un créateur et un acteur de changement.

## ✏️ Exercice pratique

Identifiez un problème concret dans votre communauté (quartier, ville, secteur) qui pourrait être résolu ou amélioré avec l'IA. Décrivez la solution en 10 lignes : quel problème, quelle IA, comment ça fonctionne, quel impact.`,
          [
            {
              question: "Comment l'IA peut-elle contribuer à améliorer la santé en zones rurales africaines ?",
              options: [
                { text: "En remplaçant complètement tous les médecins dans les hôpitaux ruraux", correct: false },
                { text: "Via des diagnostics IA, l'analyse d'images médicales et des chatbots santé accessibles par smartphone", correct: true },
                { text: "En construisant des hôpitaux automatiquement grâce à des robots IA", correct: false },
                { text: "En déplaçant les patients vers les grandes villes grâce à des véhicules autonomes", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Utilisation éthique et responsable : votre charte personnelle",
          `## 🎯 Introduction

Cette leçon vous guide pour créer votre propre charte d'utilisation éthique de l'IA — un document personnel qui définit vos valeurs et vos engagements dans votre usage quotidien de l'IA.

## 📚 Les principes d'une utilisation éthique

### 1. Transparence
Soyez honnête sur votre utilisation de l'IA quand c'est pertinent. Ne présentez pas du contenu IA comme entièrement le vôtre dans des contextes où ça compte (académique, professionnel, créatif).

### 2. Vérification
Vérifiez toujours les informations importantes générées par l'IA avant de les utiliser, les partager ou agir sur leur base.

### 3. Respect de la vie privée
Ne partagez jamais avec l'IA des données personnelles sensibles — les vôtres ou celles de tiers.

### 4. Esprit critique
Gardez toujours votre jugement actif. L'IA est un outil puissant, pas une autorité.

### 5. Inclusion
Réfléchissez à l'impact de vos usages IA sur les autres — notamment les personnes moins bien équipées ou formées.

### 6. Amélioration continue
L'IA évolue rapidement. Restez informé des nouvelles capacités ET des nouveaux risques.

## 🔍 Votre charte personnelle

Remplissez ce template :

"Je, [votre nom], m'engage à utiliser l'IA de la manière suivante :

**Ce que j'utiliserai l'IA pour :** [listez vos usages légitimes]

**Ce que je ne ferai jamais avec l'IA :** [listez vos limites]

**Comment je vérifierai les informations IA :** [votre processus]

**Comment je serai transparent sur mon usage IA :** [votre engagement]

**Comment je resterai à jour :** [vos sources d'information sur l'IA]"

## 💡 Conclusion du module 12

L'éthique de l'IA n'est pas une contrainte — c'est un avantage compétitif. Les professionnels qui utilisent l'IA de manière responsable et transparente construisent une réputation de confiance qui vaut plus que n'importe quelle automatisation.

## ✏️ Exercice final

Rédigez votre charte personnelle d'utilisation éthique de l'IA. Partagez-la avec quelqu'un de confiance pour qu'il vous aide à l'améliorer et vous tienne responsable.`,
          [
            {
              question: "Pourquoi l'éthique dans l'utilisation de l'IA est-elle considérée comme un avantage compétitif ?",
              options: [
                { text: "Parce que les entreprises éthiques paient moins d'impôts", correct: false },
                { text: "Parce qu'une utilisation responsable et transparente construit une réputation de confiance durable", correct: true },
                { text: "Parce que les IA éthiques sont plus performantes techniquement", correct: false },
                { text: "Parce que les régulateurs exemptent les entreprises éthiques des lois IA", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 13 : Projets pratiques guidés
    ══════════════════════════════════════════ */
    {
      title: "Module 13 : Projets Pratiques Guidés",
      lessons: [

        lesson(
          "Projet 1 : CV et lettre de motivation parfaits",
          `## 🎯 Introduction

Dans ce premier projet pratique, vous allez créer ou améliorer radicalement votre CV et votre lettre de motivation pour obtenir plus d'entretiens.

## 📚 Étape 1 : Audit de votre CV actuel

Si vous avez un CV, donnez-le à l'IA :
"Analyse mon CV [colle ton CV] comme un recruteur senior exigeant. Donne-moi une note sur 10 pour chaque section. Identifie les 5 faiblesses principales et les 5 forces. Que ferais-tu pour l'améliorer radicalement ?"

Si vous n'avez pas de CV, décrivez votre situation à l'IA et demandez-lui de créer votre premier CV.

## 📚 Étape 2 : Identifier votre poste cible

Choisissez le type de poste que vous souhaitez obtenir. Recherchez 3 offres réelles sur LinkedIn ou Emploi.sn. Analysez les points communs entre ces offres.

## 📚 Étape 3 : Créer le CV optimisé

Utilisez le prompt complet du Module 5 pour créer un CV adapté à votre poste cible. Le CV doit :
- Être en 1 page maximum
- Utiliser des verbes d'action dynamiques
- Inclure des résultats chiffrés
- Passer les filtres ATS

## 📚 Étape 4 : Créer la lettre de motivation

Rédigez une lettre personnalisée pour UNE offre spécifique. Utilisez les techniques du Module 5.

## 📚 Étape 5 : Test final

"Joue le rôle d'un recruteur qui reçoit mon dossier de candidature [colle CV + lettre]. Décide si tu convoques ce candidat. Explique ta décision et donne 3 derniers conseils d'amélioration."

## 🏆 Objectif de succès

Si le recruteur IA décide de convoquer votre candidature fictive, votre dossier est prêt pour de vraies candidatures !`,
          [
            {
              question: "Quel est le meilleur test pour savoir si votre dossier de candidature est prêt ?",
              options: [
                { text: "Le partager avec vos amis et voir s'ils trouvent ça bien", correct: false },
                { text: "Demander à l'IA de jouer le rôle d'un recruteur exigeant et voir s'il convoquerait le candidat", correct: true },
                { text: "L'envoyer à 100 entreprises et attendre les réponses", correct: false },
                { text: "Le faire relire par votre famille", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Projet 2 : Lancer une présence professionnelle sur les réseaux sociaux",
          `## 🎯 Introduction

Dans ce projet, vous allez créer ou transformer complètement votre présence sur les réseaux sociaux pour qu'elle soit professionnelle et cohérente avec vos objectifs.

## 📚 Phase 1 : Définir votre marque personnelle (30 min)

"Aide-moi à définir ma marque personnelle sur les réseaux sociaux. Mon profil : [décrivez]. Mes objectifs : [emploi/business/notoriété/autre]. Mon audience cible : [qui vous voulez atteindre]. Mes valeurs : [3-5 mots]. Propose :
1. Mon positionnement unique (ce que je représente)
2. Mon angle éditorial (ce dont je parle)
3. Mon ton de communication
4. Les 2 réseaux prioritaires pour moi"

## 📚 Phase 2 : Optimiser vos profils (45 min)

Pour LinkedIn : suivez le Module 5
Pour Instagram : 
- Bio professionnelle de 150 caractères (emoji + valeur + CTA)
- Photo de profil professionnelle (avec l'aide de Remove.bg)
- Mise en avant des stories essentielles

## 📚 Phase 3 : Créer le premier contenu (1 heure)

Créez 5 posts de présentation :
1. Post de présentation personnelle
2. Post sur votre expertise principale
3. Post sur une leçon apprise
4. Post sur un projet ou réalisation
5. Post sur vos valeurs ou mission

## 📚 Phase 4 : Établir la routine (permanent)

Créez un calendrier éditorial de 2 posts/semaine minimum. Utilisez Buffer ou Later pour programmer.

## 🏆 Indicateur de succès

Dans 30 jours : minimum 50 nouveaux followers qualifiés (dans votre cible) et 5 messages ou commentaires engagés.`,
          [
            {
              question: "Qu'est-ce qu'une 'marque personnelle' sur les réseaux sociaux ?",
              options: [
                { text: "Un compte payant vérifié avec un badge bleu", correct: false },
                { text: "Le positionnement unique qui définit ce que vous représentez, ce dont vous parlez et comment vous communiquez", correct: true },
                { text: "Le nombre de followers et le taux d'engagement de votre compte", correct: false },
                { text: "La charte graphique avec les couleurs et les polices de votre compte", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Projet 3 : Créer une mini-formation en ligne",
          `## 🎯 Introduction

Si vous avez une compétence que d'autres veulent apprendre, vous pouvez créer et vendre une formation en ligne. L'IA vous aidera à la structurer, la rédiger et la vendre.

## 📚 Étape 1 : Choisir votre sujet

Votre formation doit répondre à ces critères :
- Vous maîtrisez ce sujet mieux que votre audience cible
- Des gens cherchent à apprendre ça
- Le sujet est assez spécifique pour être enseigné en 5-10 leçons

Demandez à l'IA : "Valide mon idée de formation sur [sujet] pour [audience]. Est-ce viable ? Quelles sont les objections probables des acheteurs potentiels ?"

## 📚 Étape 2 : Structurer le programme

"Crée le programme complet d'une formation de 8 leçons sur [sujet] pour [audience] qui veut [objectif]. Chaque leçon doit avoir : titre accrocheur + objectif pédagogique + contenu principal + exercice pratique."

## 📚 Étape 3 : Rédiger le contenu

Pour chaque leçon, demandez à l'IA de rédiger le script ou le contenu. Personnalisez avec votre expertise et vos exemples personnels.

## 📚 Étape 4 : Créer la page de vente

"Rédige une page de vente pour ma formation [titre] sur [sujet]. Public : [description]. Résultat promis : [ce qu'ils vont savoir/faire après]. Prix : [prix en FCFA]. Inclus : titre accrocheur, problème que la formation résout, programme, témoignages fictifs (à remplacer par de vrais), prix et CTA."

## 📚 Étape 5 : Lancer la formation

Plateformes gratuites pour démarrer : Notion (gratuit), Google Classroom, ou simplement WhatsApp/Telegram pour une première cohorte.

## 🏆 Objectif

Vendre votre formation à au moins 3 personnes dans votre entourage pour valider le concept avant d'investir davantage.`,
          [
            {
              question: "Quel est le critère le plus important pour choisir le sujet de sa première formation en ligne ?",
              options: [
                { text: "Choisir le sujet le plus populaire même si vous ne le maîtrisez pas bien", correct: false },
                { text: "Choisir un sujet que vous maîtrisez mieux que votre audience cible et que des gens cherchent à apprendre", correct: true },
                { text: "Choisir le sujet pour lequel d'autres formations coûtent le plus cher", correct: false },
                { text: "Choisir un sujet que personne n'a encore traité sur internet", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Projet 4 : Rédiger un rapport professionnel complet",
          `## 🎯 Introduction

La capacité à rédiger des rapports professionnels clairs et persuasifs est l'une des compétences les plus demandées en entreprise. Ce projet vous guide pour créer un rapport de qualité.

## 📚 Choisissez votre type de rapport

**Option A : Rapport de stage**
"Rédige un rapport de stage de [durée] pour [entreprise/secteur]. Structure standard : remerciements, sommaire, introduction, présentation de l'entreprise, missions effectuées, analyse critique, conclusion et annexes."

**Option B : Rapport d'activité**
"Rédige un rapport d'activité mensuel/trimestriel. Données : [résultats, actions, problèmes rencontrés]. Audience : [directeur, investisseur, client]. Format : synthétique et factuel."

**Option C : Rapport d'analyse**
"Analyse [sujet] et présente tes conclusions dans un rapport structuré. Problématique : [décrivez]. Méthodologie : [comment vous avez collecté les informations]. Données : [vos données]. Format : académique ou professionnel selon le contexte."

## 📚 Améliorer la qualité du rapport

Une fois le premier draft généré par l'IA :
1. "Identifie les sections trop vagues et propose des exemples concrets"
2. "Rends l'introduction plus accrocheuse — elle doit captiver le lecteur dès la première phrase"
3. "Transforme les données brutes [colle les données] en insights actionnables"
4. "Crée un résumé exécutif d'une demi-page qui donne envie de lire le rapport complet"

## 🏆 Évaluation

Soumettez votre rapport à l'IA pour évaluation : "Joue le rôle du destinataire de ce rapport. Note chaque section de 1 à 10. Quel est ton impression globale ?"`,
          [
            {
              question: "Qu'est-ce qu'un 'résumé exécutif' dans un rapport professionnel ?",
              options: [
                { text: "Un résumé réservé aux PDG et directeurs généraux", correct: false },
                { text: "Une synthèse d'une demi-page qui présente les points essentiels du rapport pour les lecteurs pressés", correct: true },
                { text: "Le dernier paragraphe du rapport qui conclut les résultats", correct: false },
                { text: "Un glossaire des termes techniques utilisés dans le rapport", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Projet 5 : Plan d'affaires pour une startup",
          `## 🎯 Introduction

Dans ce projet, vous allez créer un plan d'affaires complet pour une vraie idée de startup. Ce document pourra être utilisé pour convaincre des investisseurs, des partenaires ou des institutions de financement.

## 📚 Phase 1 : L'idée et la validation

Choisissez une idée réelle ou fictive de startup. Demandez à l'IA de jouer le rôle d'un investisseur sceptique et de questionner votre idée sur tous les angles.

## 📚 Phase 2 : Le plan d'affaires complet

Utilisez ce prompt structuré :
"Crée un plan d'affaires complet de 10 pages pour ma startup :

**L'entreprise :** [nom] — [description en 1 phrase]
**Problème résolu :** [problème précis et douloureux]
**Solution :** [votre solution unique]
**Marché cible :** [qui exactement et pourquoi ils achèteront]
**Modèle économique :** [comment vous gagnez de l'argent]
**Avantage compétitif :** [pourquoi vous et pas les autres]
**Équipe :** [qui fait quoi]
**Besoin de financement :** [montant et utilisation]

Structure : executive summary, problème, solution, marché, business model, go-to-market, équipe, financials 3 ans, conclusion."

## 📚 Phase 3 : Pitch deck

"Transforme ce plan d'affaires en pitch deck de 10 slides pour une présentation de 5 minutes devant des investisseurs."

## 🏆 Résultat attendu

Un document qui serait crédible pour soumettre à une organisation de financement ou à un concours de startups africaines.`,
          [
            {
              question: "Qu'est-ce qu'un 'go-to-market strategy' dans un plan d'affaires ?",
              options: [
                { text: "Le plan de déménagement de l'entreprise vers un nouveau marché géographique", correct: false },
                { text: "La stratégie pour lancer le produit/service et acquérir les premiers clients", correct: true },
                { text: "Le plan de distribution physique des produits dans les supermarchés", correct: false },
                { text: "La stratégie d'exportation vers les marchés internationaux", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Projet 6 : Stratégie d'apprentissage personnalisée",
          `## 🎯 Introduction

Le projet final du Module 13 vous guide pour créer votre propre stratégie d'apprentissage optimisée avec l'IA — un système pour continuer à apprendre et progresser longtemps après cette formation.

## 📚 Étape 1 : Audit de vos compétences actuelles

"Tu es mon coach de développement professionnel. Je veux faire un audit honnête de mes compétences. Mon secteur : [secteur]. Mon poste actuel ou souhaité : [poste]. Aide-moi à :
1. Identifier mes 5 compétences les plus fortes
2. Identifier mes 5 lacunes les plus critiques
3. Classer ces lacunes par impact sur ma carrière/vie
4. Proposer un plan d'apprentissage sur 6 mois"

## 📚 Étape 2 : Votre plan d'apprentissage sur 6 mois

Basé sur l'audit, créez un plan détaillé :
- Compétences à développer (par ordre de priorité)
- Ressources recommandées (livres, cours, pratique)
- Objectifs mensuels mesurables
- Comment mesurer vos progrès

## 📚 Étape 3 : Identifier vos ressources d'apprentissage

"Pour la compétence [compétence], recommande-moi les meilleures ressources gratuites disponibles en ligne en français pour apprendre en autodidacte : vidéos YouTube, cours en ligne, livres PDF, communautés, podcasts."

## 📚 Étape 4 : Système de suivi et accountability

"Crée un tableau de bord simple pour suivre mon plan d'apprentissage sur 6 mois. Inclus : compétences visées, ressources, heures investies, jalons de progression, auto-évaluation mensuelle."

## 🏆 L'engagement final

L'apprentissage est un voyage, pas une destination. Engagez-vous à dédier minimum 30 minutes par jour à votre développement personnel. L'IA peut être votre meilleur allié dans ce voyage.`,
          [
            {
              question: "Quelle est la durée quotidienne minimale recommandée pour un apprentissage efficace continu ?",
              options: [
                { text: "8 heures par jour — comme une journée de travail complète", correct: false },
                { text: "30 minutes par jour de manière régulière et disciplinée", correct: true },
                { text: "1 semaine intensive par mois seulement", correct: false },
                { text: "Il n'y a pas de durée minimale recommandée", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 14 : Études de cas réels
    ══════════════════════════════════════════ */
    {
      title: "Module 14 : Études de Cas Réels",
      lessons: [

        lesson(
          "Cas 1 : L'IA pour réussir au baccalauréat",
          `## 🎯 Introduction

Rencontrons Aminata, 17 ans, en Terminale S à Dakar. Elle a 3 mois pour préparer son baccalauréat avec des difficultés en Mathématiques et en Physique-Chimie. Voici comment elle peut utiliser l'IA pour transformer ses résultats.

## 📚 La situation d'Aminata

**Profil :** Bonne élève en SVT et Philosophie, difficultés en Maths (12/20) et Physique (11/20)
**Objectif :** Obtenir le bac avec mention Bien (≥14/20 de moyenne)
**Ressources :** Smartphone, accès WiFi à la maison, 3 mois disponibles

## 📚 Stratégie IA d'Aminata

### Semaine 1-2 : Audit des lacunes
"Je suis en Terminale S sénégalaise. Je dois passer le baccalauréat en [date]. Mes difficultés principales : les suites numériques, les intégrales, et l'électrocinétique. Crée-moi un diagnostic précis avec 5 questions sur chaque thème pour identifier mes lacunes."

### Semaine 3-8 : Révision intensive thème par thème
"Explique-moi les suites arithmétiques et géométriques en termes simples avec 5 exemples progressifs. Ensuite donne-moi 3 exercices du plus simple au plus difficile avec les corrections détaillées."

### Semaine 9-11 : Examens blancs
"Crée-moi un examen blanc de mathématiques de niveau bac sénégalais S. Durée : 4 heures. Inclus toutes les parties habituelles. Fournis le corrigé complet après."

### Semaine 12 : Révision finale
"Crée-moi un résumé d'une page des formules et théorèmes essentiels de mathématiques à ne jamais oublier pour le bac S sénégalais."

## 🏆 Résultat

En 3 mois avec cette méthode, Aminata peut espérer gagner 2-3 points de moyenne. Ce sont exactement les points qui font la différence entre le bac simple et la mention.

## ✏️ Exercice

Identifiez vos propres matières difficiles. Créez votre version du plan d'Aminata adapté à votre situation.`,
          [
            {
              question: "Dans l'étude de cas d'Aminata, quelle est la première étape recommandée avant de commencer la révision ?",
              options: [
                { text: "Créer immédiatement des fiches de révision pour toutes les matières", correct: false },
                { text: "Faire un audit précis de ses lacunes grâce à des questions diagnostiques", correct: true },
                { text: "Relire tous les cours de l'année du début à la fin", correct: false },
                { text: "Passer directement aux examens blancs pour évaluer son niveau", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Cas 2 : L'IA pour décrocher un stage",
          `## 🎯 Introduction

Moussa, 22 ans, étudiant en Master 1 Gestion à l'UCAD, cherche un stage de fin d'études dans une entreprise internationale. Il postule depuis 2 mois sans résultat. Découvrez comment l'IA peut transformer sa démarche.

## 📚 Le problème de Moussa

Moussa envoie le même CV et la même lettre à toutes les entreprises. Ses candidatures ne passent même pas le premier filtre. Il pense que "c'est difficile" mais le vrai problème est sa méthode, pas son profil.

## 📚 La transformation avec l'IA

### Étape 1 : Diagnostic du CV
Moussa donne son CV à ChatGPT qui identifie immédiatement : descriptions vagues, pas de résultats chiffrés, style ancien, 3 fautes d'orthographe.

### Étape 2 : CV ciblé par type d'entreprise
Au lieu d'un CV générique, Moussa crée 3 versions :
- Version "Entreprise multinationale" (en français ou anglais)
- Version "ONG/Organisation internationale"
- Version "PME/Startup africaine"

### Étape 3 : Lettres de motivation hyperpersonnalisées
Pour chaque entreprise, Moussa utilise l'IA pour rechercher l'actualité récente et intègre une référence spécifique dans sa lettre.

### Étape 4 : Stratégie de réseau
Au lieu d'attendre les offres, Moussa identifie 20 entreprises cibles. Pour chacune, il trouve un contact LinkedIn et envoie un message personnalisé : "Bonjour [prénom], je suis étudiant en gestion à l'UCAD et j'admire le travail de [entreprise] sur [projet récent]. Seriez-vous disponible pour un appel de 15 minutes ?"

## 🏆 Résultat

En 30 jours avec cette approche, Moussa obtient 3 entretiens et 1 offre de stage acceptée.

## 💡 La leçon

La recherche de stage n'est pas une loterie. C'est un processus systématique que l'IA peut optimiser considérablement.`,
          [
            {
              question: "Quel était le vrai problème de Moussa dans sa recherche de stage ?",
              options: [
                { text: "Son profil académique n'était pas assez fort", correct: false },
                { text: "Il n'y avait pas assez de stages disponibles à Dakar", correct: false },
                { text: "Sa méthode (même CV générique pour tout le monde, pas de réseau) était inefficace", correct: true },
                { text: "Il cherchait des stages trop ambitieux pour son niveau", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Cas 3 : L'IA pour vendre en ligne au Sénégal",
          `## 🎯 Introduction

Fatou, 30 ans, couturière à Dakar, veut vendre ses créations en ligne pour toucher la diaspora sénégalaise en France et aux États-Unis. Elle n'a jamais utilisé les réseaux sociaux professionnellement. Découvrons comment l'IA l'aide à lancer sa boutique.

## 📚 Le projet de Fatou

**Produit :** Vêtements africains modernes (robes, ensembles, accessoires)
**Budget :** 300 000 FCFA
**Marché cible :** Diaspora sénégalaise en France et aux États-Unis
**Objectif :** 500 000 FCFA de chiffre d'affaires dans les 6 premiers mois

## 📚 La stratégie IA de Fatou

### Phase 1 : Construction de la présence en ligne
L'IA aide Fatou à créer :
- Un nom de marque mémorable et vendable internationalement
- Une bio Instagram en français et en anglais
- Des descriptions de produits en 2 langues
- Une palette de couleurs cohérente

### Phase 2 : Contenu pour la diaspora
"Crée pour ma boutique de vêtements africains [nom] des posts Instagram ciblant la diaspora sénégalaise en France. Posts mettant en valeur la nostalgie, la fierté culturelle et la beauté des tissus africains. Ton : chaleureux et authentique."

### Phase 3 : Service client bilingue
L'IA crée des templates de réponses en français et en anglais pour toutes les situations courantes : commandes, questions sur les tailles, expédition internationale, retours.

### Phase 4 : Stratégie de prix internationale
L'IA aide à calculer les prix qui incluent les frais d'expédition internationale, les conversions de devises et les marges appropriées.

## 🏆 Résultat à 6 mois

Avec 50 posts Instagram et une stratégie cohérente, Fatou atteint 3 000 abonnés qualifiés et réalise ses premières ventes. Son objectif de 500 000 FCFA est atteignable dans l'année.`,
          [
            {
              question: "Quel est l'avantage principal d'utiliser l'IA pour cibler la diaspora africaine ?",
              options: [
                { text: "L'IA peut livrer les produits directement à l'étranger", correct: false },
                { text: "L'IA peut créer du contenu bilingue et culturellement adapté pour toucher la diaspora efficacement", correct: true },
                { text: "L'IA peut créer des comptes Instagram dans plusieurs pays simultanément", correct: false },
                { text: "L'IA peut traiter les paiements internationaux automatiquement", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Cas 4 : L'IA pour apprendre la programmation",
          `## 🎯 Introduction

Ibrahim, 25 ans, diplômé en mathématiques, veut reconvertir dans le développement web. Sans argent pour payer une formation (souvent 2-3 millions de FCFA), il décide d'utiliser l'IA comme tuteur gratuit. Est-ce possible ?

## 📚 Le défi d'Ibrahim

**Objectif :** Devenir développeur web junior en 6 mois
**Budget formation :** 0 FCFA
**Temps disponible :** 4 heures par jour
**Avantage :** Bonne base en logique mathématique

## 📚 Le curriculum IA d'Ibrahim

Ibrahim utilise ChatGPT pour créer son curriculum complet :

"Je veux apprendre le développement web en autodidacte en 6 mois pour devenir développeur junior. Mes bases : mathématiques fortes, zéro connaissance en code. Crée un curriculum progressif mois par mois avec : compétences à acquérir, projets pratiques, ressources gratuites, et critères de validation de chaque étape."

ChatGPT lui génère un curriculum complet :
- Mois 1-2 : HTML, CSS, bases du web
- Mois 3 : JavaScript fondamentaux
- Mois 4-5 : React ou Vue.js, APIs
- Mois 6 : Projet portfolio + préparation aux entretiens

## 📚 L'IA comme tuteur quotidien

Chaque jour, Ibrahim utilise l'IA pour :
- Expliquer les concepts qu'il ne comprend pas
- Corriger son code et expliquer les erreurs
- Générer des exercices de difficulté progressive
- Simuler des entretiens techniques

## 🏆 Résultat à 6 mois

Ibrahim a 4 projets dans son portfolio. Il passe des entretiens de développeur junior. Dans 3 mois supplémentaires, il décroche son premier CDD de développeur.

**Coût total de la formation : 0 FCFA + 4 heures/jour d'engagement.**`,
          [
            {
              question: "Quelle était la clé du succès d'Ibrahim dans son apprentissage autodidacte ?",
              options: [
                { text: "Il avait accès à des outils IA payants très coûteux", correct: false },
                { text: "L'IA ne remplace pas vraiment les formations professionnelles coûteuses", correct: false },
                { text: "L'engagement quotidien (4h/jour) combiné à l'IA comme tuteur gratuit et illimité", correct: true },
                { text: "Il avait des contacts dans des entreprises tech qui l'ont aidé", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Cas 5 : L'IA pour créer du contenu viral africain",
          `## 🎯 Introduction

Seynabou, 28 ans, journaliste freelance, veut créer un compte Instagram sur la culture et l'entrepreneuriat africains. Elle connaît son sujet mais manque de temps pour créer du contenu régulièrement. L'IA va lui permettre de multiplier sa productivité.

## 📚 Le système de création de Seynabou

### Le batch hebdomadaire (2 heures chaque dimanche)

Seynabou passe 2 heures le dimanche à créer tout son contenu de la semaine avec l'IA :

**1. Génération des idées (30 min)**
"Pour mon compte Instagram sur l'entrepreneuriat et la culture africaine, génère 20 idées de posts pour cette semaine. Mix : 7 éducatifs, 5 inspirants, 5 culturels, 3 divertissants. Tendances actuelles : [actualité de la semaine]."

**2. Rédaction du contenu (60 min)**
Pour chaque idée sélectionnée : "Rédige un post Instagram sur [idée]. Hook percutant, 150 mots, emojis, 10 hashtags pertinents #afrique #entrepreneuriat..."

**3. Création visuelle (30 min)**
Avec les prompts générés par ChatGPT, Seynabou crée ses visuels en 3 minutes par post dans Canva.

**Résultat :** 7 posts complets et programmés en 2 heures.

## 📚 Le secret du contenu viral africain

"Quels types de contenu fonctionnent le mieux sur Instagram pour une audience africaine francophone de 18-35 ans en 2024 ? Analyse les tendances et donne-moi les 5 formats qui génèrent le plus d'engagement."

## 🏆 Résultat à 6 mois

Seynabou passe de 500 à 15 000 abonnés. Elle commence à être contactée pour des partenariats et du contenu sponsorisé.`,
          [
            {
              question: "Qu'est-ce que le 'batch content creation' utilisé par Seynabou ?",
              options: [
                { text: "Créer du contenu en collaboration avec d'autres créateurs (batch = groupe)", correct: false },
                { text: "Créer tout son contenu de la semaine en une seule session dédiée plutôt que de le faire au jour le jour", correct: true },
                { text: "Publier tous ses posts en une seule fois plutôt que les programmer", correct: false },
                { text: "Un logiciel de création de contenu en masse", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Cas 6 : L'IA pour gérer une association",
          `## 🎯 Introduction

Dans notre dernier cas pratique, découvrons comment une association de jeunes à Thiès utilise l'IA pour professionnaliser sa gestion et maximiser son impact sans budget dédié.

## 📚 L'association GEN-Afrique

**Profil :** Association de 50 membres actifs, âge moyen 24 ans
**Mission :** Formation numérique pour les jeunes de la région de Thiès
**Problème :** Gestion chronophage, communications insuffisantes, difficultés à trouver des partenaires

## 📚 L'IA au service de l'association

### 1. Communication professionnelle
L'IA aide à rédiger tous les documents officiels :
- Statuts de l'association (cadre légal sénégalais)
- Règlement intérieur
- Communiqués de presse
- Rapport d'activités annuel
- Lettres de partenariat

### 2. Levée de fonds et subventions
"Rédige un dossier de demande de subvention pour notre association [description]. Organisation donatrice : [ONU, UE, fondation privée]. Inclus : présentation de l'association, problème social résolu, programme d'activités, budget prévisionnel, impact attendu et indicateurs de mesure."

### 3. Gestion des communications
L'IA crée une newsletter mensuelle, des posts réseaux sociaux et des rapports pour les partenaires — automatisant ce qui prenait 20 heures par mois à l'équipe.

### 4. Formation des membres
L'IA crée des modules de formation sur le leadership, la gestion de projet et la communication pour les bénévoles.

## 🏆 Impact en 1 an

Avec l'aide de l'IA : 3 nouveaux partenariats obtenus, 2 subventions reçues (total : 15 millions FCFA), 300 jeunes formés au numérique.

## ✏️ Exercice pratique

Si vous faites partie d'une association ou d'une organisation communautaire, identifiez 3 tâches chronophages qui pourraient être assistées par l'IA. Créez les prompts correspondants.`,
          [
            {
              question: "Comment l'IA peut-elle aider une association à but non lucratif ?",
              options: [
                { text: "Uniquement en gérant les comptes bancaires de l'association", correct: false },
                { text: "En automatisant la communication, en rédigeant les dossiers de subvention et en créant du contenu de formation", correct: true },
                { text: "Seulement les grandes associations avec un budget important peuvent utiliser l'IA", correct: false },
                { text: "L'IA ne peut pas aider les organisations sans but lucratif", correct: false },
              ],
            },
          ]
        ),
      ],
    },

    /* ══════════════════════════════════════════
       MODULE 15 : Projet final
    ══════════════════════════════════════════ */
    {
      title: "Module 15 : Projet Final et Perspectives",
      lessons: [

        lesson(
          "Bilan et consolidation des acquis",
          `## 🎯 Introduction

Vous avez parcouru un chemin extraordinaire ! Ce module final est l'occasion de consolider tous vos acquis, d'identifier vos points forts et de préparer votre projet final.

## 📚 Ce que vous maîtrisez maintenant

### Les fondamentaux ✅
- Comprendre ce qu'est l'IA et comment elle fonctionne
- Connaître l'histoire et les types d'IA
- Identifier les limites et risques de l'IA

### Les outils ✅
- ChatGPT, Gemini, Claude, Copilot, Perplexity
- Midjourney, DALL·E, Canva IA pour le design
- Zapier, Make.com pour l'automatisation

### Le prompt engineering ✅
- La formule RTCFE
- Chain-of-Thought et Few-Shot
- Templates prêts à l'emploi

### Les applications pratiques ✅
- IA pour les études, la carrière, les affaires
- IA pour le développement, la création de contenu, le design
- IA pour l'automatisation et la productivité

### L'éthique ✅
- Propriété intellectuelle et confidentialité
- Esprit critique et vérification des faits
- Usage responsable

## 📚 Votre auto-évaluation

Répondez honnêtement à ces questions :
1. Quels modules ont eu le plus d'impact sur votre vie/travail ?
2. Quelles compétences avez-vous le mieux maîtrisées ?
3. Dans quels domaines voulez-vous approfondir vos connaissances ?
4. Quels changements concrets avez-vous déjà opérés grâce à cette formation ?

## 💡 La vraie transformation

La maîtrise de l'IA n'est pas dans la connaissance des outils — c'est dans leur **application régulière** à vos problèmes réels. Les personnes qui transforment leur vie grâce à l'IA sont celles qui commencent à l'utiliser quotidiennement dès aujourd'hui.

## ✏️ Exercice de bilan

Demandez à ChatGPT : "Je viens de terminer une formation complète sur l'IA. Aide-moi à créer un plan d'action pour intégrer l'IA dans ma vie professionnelle et personnelle sur les 90 prochains jours, avec des objectifs hebdomadaires précis et mesurables."`,
          [
            {
              question: "Qu'est-ce qui définit vraiment la maîtrise de l'IA selon ce module ?",
              options: [
                { text: "Avoir mémorisé toutes les fonctionnalités de chaque outil", correct: false },
                { text: "Avoir un abonnement payant à tous les outils premium", correct: false },
                { text: "L'application régulière et quotidienne de l'IA à ses problèmes réels", correct: true },
                { text: "Avoir lu tous les livres sur l'IA publiés depuis 2020", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Concevoir et planifier votre projet final",
          `## 🎯 Introduction

Votre projet final est la démonstration de tout ce que vous avez appris. C'est votre chef-d'œuvre IA — quelque chose qui a une vraie valeur pour vous, votre famille, votre communauté ou votre carrière.

## 📚 Comment choisir votre projet final

Votre projet final doit répondre à au moins 3 de ces critères :
- Il résout un vrai problème que vous ou votre entourage avez
- Il utilise au moins 5 compétences différentes apprises dans la formation
- Il peut être présenté et partagé avec d'autres
- Il a une valeur concrète (économique, sociale, éducative)
- Il vous rend fier(e)

## 📚 Exemples de projets finaux

**Pour les étudiants :**
Un système de révision complet pour votre classe : programme de révision, fiches, examens blancs, et guide d'utilisation de l'IA pour 30 camarades.

**Pour les entrepreneurs :**
Le lancement réel d'une micro-activité avec : concept validé, business plan, kit marketing, site/page web, et premières ventes documentées.

**Pour les créateurs :**
Un compte de contenu lancé sur les réseaux sociaux avec : 30 posts publiés, stratégie documentée, métriques sur 30 jours, et plan pour les 90 jours suivants.

**Pour les professionnels :**
Un système d'optimisation de votre travail quotidien : workflows automatisés, templates, gains de temps documentés, et guide pour vos collègues.

**Pour les citoyens engagés :**
Un projet communautaire : guide d'utilisation de l'IA pour les PME de votre quartier, initiation pour les jeunes de votre communauté, etc.

## 📚 Plan de projet

"Aide-moi à planifier mon projet final de formation IA. Voici mon idée : [description]. Aide-moi à créer :
1. Les objectifs SMART du projet
2. Les étapes de réalisation semaine par semaine
3. Les compétences IA que j'utiliserai pour chaque étape
4. Les ressources et outils nécessaires
5. Les critères de succès mesurables"

## ✏️ Exercice

Choisissez votre projet final. Rédigez une description de 200 mots. Créez votre plan de réalisation sur 3 semaines.`,
          [
            {
              question: "Quelles sont les caractéristiques d'un bon projet final de formation ?",
              options: [
                { text: "Il doit être le plus techniquement complexe possible pour impressionner", correct: false },
                { text: "Il résout un vrai problème, utilise plusieurs compétences apprises et a une valeur concrète", correct: true },
                { text: "Il doit obligatoirement être une application informatique fonctionnelle", correct: false },
                { text: "Il doit être gardé secret pour protéger son idée originale", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Réaliser votre projet final",
          `## 🎯 Introduction

C'est le moment de passer à l'action ! Cette leçon vous guide dans la réalisation concrète de votre projet final, avec un soutien IA à chaque étape.

## 📚 Semaine 1 : Les fondations

**Jours 1-2 : Recherche et planification approfondie**
"Pour mon projet [description], aide-moi à :
1. Collecter toutes les informations dont j'ai besoin
2. Identifier les obstacles potentiels et comment les surmonter
3. Créer un backlog détaillé de toutes les tâches
4. Prioriser les tâches (urgent + important en premier)"

**Jours 3-5 : Création du contenu principal**
Commencez à produire le cœur de votre projet avec l'aide de l'IA.

**Jours 6-7 : Premier bilan**
"Évalue mon avancement sur ce projet [décrivez où vous en êtes]. Identifie les gaps par rapport au plan initial. Recommande des ajustements si nécessaire."

## 📚 Semaine 2 : La réalisation

Continuez selon votre plan. Utilisez l'IA pour :
- Débloquer les obstacles rencontrés
- Améliorer la qualité de votre travail
- Tester votre projet avec de vraies personnes

## 📚 Semaine 3 : La finalisation

**Jours 1-3 : Finition et qualité**
"Voici mon projet [présentez-le]. En tant qu'expert critique, identifie ce qui manque ou pourrait être amélioré avant la présentation finale."

**Jours 4-5 : Documentation**
Documentez votre processus : "Crée un guide de 2 pages expliquant comment j'ai réalisé ce projet avec l'IA, les défis rencontrés et les leçons apprises."

**Jours 6-7 : Préparation de la présentation**

## 💡 Conseil de réalisation

La perfection est l'ennemi du fait. Votre projet n'a pas besoin d'être parfait — il doit exister et avoir une valeur réelle. Un projet imparfait qui existe vaut infiniment plus qu'un projet parfait qui reste dans votre tête.`,
          [
            {
              question: "Quel est le principe clé pour la réalisation d'un projet ?",
              options: [
                { text: "Attendre que tout soit parfait avant de commencer à produire", correct: false },
                { text: "Un projet imparfait qui existe vaut plus qu'un projet parfait qui reste dans la tête", correct: true },
                { text: "Garder le projet secret jusqu'à ce qu'il soit complètement terminé", correct: false },
                { text: "Déléguer entièrement le projet à l'IA pour maximiser l'efficacité", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Présenter et valoriser votre projet final",
          `## 🎯 Introduction

Un excellent projet qui est mal présenté perd 50% de sa valeur. Cette leçon vous apprend à présenter votre projet de manière percutante et à en tirer le maximum de valeur.

## 📚 La présentation de votre projet

### Format de présentation (5-7 minutes)

"Aide-moi à créer une présentation de mon projet final [description]. Structure :
1. **Le problème** (30 sec) : Quel problème existait avant mon projet ?
2. **Ma solution** (1 min) : Qu'est-ce que j'ai créé/réalisé ?
3. **La démonstration** (2-3 min) : Montrer concrètement ce qui a été produit
4. **L'impact** (1 min) : Qu'est-ce que ça change ? Pour qui ? Avec quels résultats mesurables ?
5. **Les leçons** (30 sec) : Ce que j'ai appris sur l'IA et sur moi-même
6. **La suite** (30 sec) : Comment je compte continuer à utiliser l'IA"

### Matériaux de présentation
- Slides avec Gamma.app (générés en 2 minutes)
- Démonstration live du projet
- Portfolio des documents produits

## 📚 Valoriser votre projet dans votre carrière

**Sur LinkedIn :**
"Rédige un post LinkedIn annonçant mon projet de formation IA [description]. Mets en valeur : les compétences acquises, l'impact du projet, et ce que je cherche à faire ensuite (emploi, clients, collaborateurs)."

**Dans un CV :**
"Rédige la description de ce projet pour l'intégrer dans mon CV comme expérience. Utilise des verbes d'action et des résultats chiffrés."

## 💡 La vraie récompense

Plus que le certificat ou la note, votre vrai résultat c'est la transformation. Vous êtes maintenant quelqu'un qui utilise l'IA de manière professionnelle — une compétence rare et précieuse en Afrique.

## ✏️ Préparation

Préparez votre présentation de 5 minutes. Entraînez-vous devant un miroir ou filmez-vous. Demandez à l'IA de jouer le rôle d'un jury exigeant et de vous poser des questions difficiles.`,
          [
            {
              question: "Pourquoi est-il important de présenter son projet final de manière professionnelle ?",
              options: [
                { text: "Pour impressionner les autres étudiants de la formation", correct: false },
                { text: "Un projet bien présenté peut être valorisé dans un CV, sur LinkedIn et lors d'entretiens professionnels", correct: true },
                { text: "La présentation est uniquement exigée pour obtenir le certificat", correct: false },
                { text: "C'est obligatoire selon les règles de la formation", correct: false },
              ],
            },
          ]
        ),

        lesson(
          "Évaluation finale et prochaines étapes",
          `## 🎯 Introduction

Vous êtes arrivé à la fin de votre formation. Cette leçon est votre évaluation finale, votre certificat de compétences, et surtout votre feuille de route pour la suite.

## 📚 L'évaluation finale

Répondez à ces 10 questions pour auto-évaluer votre niveau :

1. Quelle est la différence entre IA Étroite et AGI ?
2. Citez 5 outils IA et leur cas d'usage principal
3. Qu'est-ce que la formule RTCFE ?
4. Comment éviter les hallucinations de l'IA ?
5. Quelle est la différence entre biais algorithmique et hallucination ?
6. Citez 3 utilisations légitimes et 1 utilisation non éthique de l'IA
7. Quel outil utiliseriez-vous pour analyser un document de 50 pages ?
8. Comment automatiser une tâche répétitive dans votre travail ?
9. Quelle est votre stratégie de contenu idéale sur les réseaux sociaux ?
10. Quel est le premier projet IA que vous allez lancer cette semaine ?

## 📚 Vos prochaines étapes

### Les 7 prochains jours
- Intégrer l'IA dans 1 tâche quotidienne
- Pratiquer 1 nouvelle compétence de la formation chaque jour
- Partager votre premier post sur votre utilisation de l'IA

### Les 30 prochains jours
- Utiliser l'IA pour un vrai projet professionnel ou académique
- Former 1 personne de votre entourage à l'utilisation basique de l'IA
- Rejoindre une communauté en ligne sur l'IA (ex: groupes Facebook, Discord)

### Les 90 prochains jours
- Monétiser vos nouvelles compétences IA (consulting, formation, service)
- Réaliser votre projet final ou un nouveau projet plus ambitieux
- Se tenir informé des évolutions de l'IA (suivre des newsletters, blogs)

## 🏆 Ce que vous avez accompli

En terminant cette formation, vous faites partie des personnes les mieux équipées de votre entourage pour naviguer dans le monde de l'IA. Cela représente un avantage compétitif réel et immédiat.

## 💡 Le message final

L'IA est l'outil le plus puissant jamais mis à la disposition des individus. Elle efface partiellement les inégalités d'accès aux ressources et aux experts. Un étudiant sénégalais avec ChatGPT et les bonnes compétences a accès à un niveau de support que seuls les privilégiés avaient autrefois.

**Utilisez cet avantage. Partagez ces connaissances. Transformez votre vie et contribuez à celle de votre communauté.**

Bonne continuation et félicitations pour cette transformation ! 🎉

## ✏️ Engagement final

Rédigez votre engagement public : "Je, [votre nom], m'engage à utiliser l'IA pour [votre objectif principal] dans les 30 prochains jours. Mon premier pas concret dès demain sera de [action spécifique]."

Partagez cet engagement sur les réseaux sociaux avec le hashtag #MaodoNumerique !`,
          [
            {
              question: "Quel est le meilleur moyen de consolider les compétences acquises dans cette formation ?",
              options: [
                { text: "Relire les leçons de la formation plusieurs fois", correct: false },
                { text: "Acheter d'autres formations sur l'IA immédiatement", correct: false },
                { text: "Intégrer l'IA dans une tâche quotidienne réelle et former son entourage", correct: true },
                { text: "Mémoriser toutes les fonctionnalités de chaque outil", correct: false },
              ],
            },
            {
              question: "Quelle est la vision finale de cette formation concernant l'IA et l'Afrique ?",
              options: [
                { text: "L'IA est une menace pour les économies africaines", correct: false },
                { text: "L'IA est une opportunité unique pour réduire les inégalités et permettre aux Africains de concurrencer globalement", correct: true },
                { text: "L'Afrique devrait attendre que les pays développés maîtrisent l'IA avant de l'adopter", correct: false },
                { text: "L'IA est trop complexe pour être utilisée sans formation universitaire avancée", correct: false },
              ],
            },
          ]
        ),
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
   SEED FUNCTION
───────────────────────────────────────────── */
async function main() {
  console.log(`\n🤖 Seed — Formation IA : ${FORMATION.slug}\n`);

  // 1. Check / cleanup existing
  const existing = await db.select().from(formationsTable).where(eq(formationsTable.slug, FORMATION.slug)).limit(1);

  if (existing.length > 0) {
    console.log(`⚠️  Formation existante (id=${existing[0].id}). Suppression et recréation…`);
    const formId = existing[0].id;

    // delete in order
    const existingMods = await db.select().from(modulesTable).where(eq(modulesTable.formationId, formId));
    for (const mod of existingMods) {
      const existingLessons = await db.select().from(lessonsTable).where(eq(lessonsTable.moduleId, mod.id));
      for (const les of existingLessons) {
        const existingQuizzes = await db.select().from(quizzesTable).where(eq(quizzesTable.lessonId, les.id));
        for (const quiz of existingQuizzes) {
          await db.delete(quizOptionsTable).where(eq(quizOptionsTable.quizId, quiz.id));
        }
        await db.delete(quizzesTable).where(eq(quizzesTable.lessonId, les.id));
      }
      await db.delete(lessonsTable).where(eq(lessonsTable.moduleId, mod.id));
    }
    await db.delete(modulesTable).where(eq(modulesTable.formationId, formId));
    await db.delete(formationsTable).where(eq(formationsTable.id, formId));
    console.log(`✅ Nettoyage effectué.\n`);
  }

  // 2. Create formation
  const [formation] = await db.insert(formationsTable).values({
    slug: FORMATION.slug,
    title: FORMATION.title,
    description: FORMATION.description,
    category: FORMATION.category,
    active: true,
  }).returning();
  console.log(`✅ Formation créée : "${formation.title}" (id=${formation.id})`);

  let totalLessons = 0;
  let totalQuizzes = 0;

  // 3. Create modules + lessons + quizzes
  for (let mi = 0; mi < FORMATION.modules.length; mi++) {
    const modData = FORMATION.modules[mi];

    const [mod] = await db.insert(modulesTable).values({
      formationId: formation.id,
      title: modData.title,
      order: mi + 1,
    }).returning();

    console.log(`\n  📚 Module ${mi + 1}: ${modData.title} (${modData.lessons.length} leçons)`);

    for (let li = 0; li < modData.lessons.length; li++) {
      const lesData = modData.lessons[li];

      const [les] = await db.insert(lessonsTable).values({
        moduleId: mod.id,
        title: lesData.title,
        theory: lesData.theory,
        mediaType: "none",
        order: li + 1,
      }).returning();

      totalLessons++;

      // Create quizzes
      for (let qi = 0; qi < lesData.quizzes.length; qi++) {
        const qData = lesData.quizzes[qi];

        const [quiz] = await db.insert(quizzesTable).values({
          lessonId: les.id,
          question: qData.question,
          order: qi + 1,
        }).returning();

        totalQuizzes++;

        for (let oi = 0; oi < qData.options.length; oi++) {
          const opt = qData.options[oi];
          await db.insert(quizOptionsTable).values({
            quizId: quiz.id,
            text: opt.text,
            isCorrect: opt.correct,
            order: oi + 1,
          });
        }
      }
    }

    process.stdout.write(`     → ${modData.lessons.length} leçons créées\n`);
  }

  console.log(`\n🎉 Seed terminé avec succès !`);
  console.log(`   Formation : "${formation.title}"`);
  console.log(`   Modules   : ${FORMATION.modules.length}`);
  console.log(`   Leçons    : ${totalLessons}`);
  console.log(`   Quiz      : ${totalQuizzes} questions\n`);
}

main().catch((err) => {
  console.error("❌ Erreur de seed :", err);
  process.exit(1);
}).finally(() => process.exit(0));
