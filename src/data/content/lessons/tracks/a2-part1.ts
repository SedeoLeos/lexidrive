import { L } from '../../generator';

/** A2 — Quotidien (leçons 4 à 22). */
export const A2_PART1 = [
  L(
    "Raconter sa journée d'hier",
    "Dire ce que l'on a fait hier, du matin au soir.",
    'a2-past-irregular',
    `
yesterday | hier | Yesterday I got up early.
woke | me suis réveillé (wake) | I woke at six.
got up | me suis levé | I got up at seven.
had | ai eu, ai pris (have) | I had breakfast at home.
went | suis allé (go) | I went to work by bus.
took | ai pris (take) | I took the train.
met | ai rencontré (meet) | I met a friend for lunch.
ate | ai mangé (eat) | We ate pizza.
drank | ai bu (drink) | I drank too much coffee.
bought | ai acheté (buy) | I bought some bread.
came | suis venu (come) | My sister came home late.
saw | ai vu (see) | I saw a good film.
spoke | ai parlé (speak) | I spoke to my boss.
wrote | ai écrit (write) | I wrote three emails.
felt | me suis senti (feel) | I felt tired in the evening.
slept | ai dormi (sleep) | I slept very well.
busy | chargé | It was a busy day.
then | ensuite | Then I went home.
after that | après ça | After that, I cooked dinner.
finally | enfin | Finally, I went to bed.`,
    `
What did you do yesterday? | Qu'as-tu fait hier ?
I had a really busy day. | J'ai eu une journée très chargée.
Then I went to the gym. | Ensuite je suis allé à la salle de sport.
I didn't sleep very well. | Je n'ai pas très bien dormi.
After that, I met some friends. | Après ça, j'ai retrouvé des amis.`,
    "Raconte ta journée d'hier en 10 phrases avec first, then, after that, finally. Traduis avec au moins 8 verbes irréguliers.",
  ),
  L(
    "Souvenirs d'enfance",
    'Parler de son enfance et de ses souvenirs.',
    'a2-past-regular',
    `
childhood | enfance | I had a happy childhood.
remember | se souvenir | I remember my first school.
played | ai joué | We played in the street.
lived | ai habité | We lived in a small village.
loved | ai adoré | I loved my grandmother's cakes.
hated | ai détesté | I hated vegetables.
wanted | voulais | I wanted to be a pilot.
walked | marchais | We walked to school.
visited | rendais visite | We visited our cousins every summer.
climbed | grimpais | I climbed trees.
watched | regardais | I watched cartoons on Saturday.
toy | jouet | My favourite toy was a red car.
kid | gamin | When I was a kid, I was shy.
young | jeune | When I was young, I lived in Dakar.
primary school | école primaire | My primary school was very small.
grandparents | grands-parents | I often stayed with my grandparents.
memory | souvenir | It is a good memory.
naughty | turbulent | I was a naughty child.
shy | timide | I was very shy at school.
ago | il y a | That was twenty years ago.`,
    `
When I was a child, I lived in the countryside. | Quand j'étais enfant, je vivais à la campagne.
I remember my first teacher. | Je me souviens de ma première maîtresse.
We played outside every day. | Nous jouions dehors tous les jours.
I wanted to be a doctor. | Je voulais être médecin.
It was a long time ago. | C'était il y a longtemps.`,
    "Raconte un souvenir d'enfance marquant en français, puis traduis-le au prétérit (verbes réguliers en -ed).",
  ),
  L(
    'Un voyage passé',
    'Raconter un voyage et ses étapes.',
    'a2-past-irregular',
    `
trip | voyage | Our trip to Italy was amazing.
flew | ai pris l'avion (fly) | We flew to Rome.
drove | ai conduit (drive) | We drove to the coast.
stayed | ai logé | We stayed in a small hotel.
found | ai trouvé (find) | We found a nice restaurant.
lost | ai perdu (lose) | I lost my passport.
left | suis parti (leave) | We left early in the morning.
arrived | suis arrivé | We arrived at night.
spent | ai passé, dépensé (spend) | We spent a week there.
took | ai pris (take) | I took hundreds of photos.
swam | ai nagé (swim) | We swam in the sea.
tried | ai essayé, goûté | I tried the local food.
guide | guide | Our guide was very funny.
sightseeing | tourisme, visites | We did a lot of sightseeing.
amazing | incroyable | The view was amazing.
crowded | bondé | The museum was crowded.
journey | trajet | The journey was long.
abroad | à l'étranger | It was my first trip abroad.
luggage | bagages | Our luggage was very heavy.
unforgettable | inoubliable | It was an unforgettable trip.`,
    `
Where did you go on holiday? | Où es-tu parti en vacances ?
We flew to Lisbon and stayed a week. | Nous sommes allés à Lisbonne en avion et y sommes restés une semaine.
The food was delicious. | La nourriture était délicieuse.
We didn't have enough time. | Nous n'avons pas eu assez de temps.
It was an unforgettable trip. | C'était un voyage inoubliable.`,
    'Raconte ton meilleur voyage : où, avec qui, ce que vous avez fait et un problème rencontré. Traduis au prétérit.',
  ),
  L(
    "À l'aéroport",
    'Enregistrer ses bagages, passer la sécurité, embarquer.',
    'a2-will',
    `
airport | aéroport | We arrived at the airport early.
flight | vol | Our flight is at nine.
check in | s'enregistrer | You can check in online.
boarding pass | carte d'embarquement | Here is your boarding pass.
gate | porte d'embarquement | Go to gate twelve.
security | contrôle de sécurité | The security queue is long.
passport | passeport | Show your passport, please.
luggage | bagages | My luggage is lost.
suitcase | valise | My suitcase is too heavy.
hand luggage | bagage à main | One piece of hand luggage only.
delay | retard | There is a two hour delay.
cancelled | annulé | The flight is cancelled.
board | embarquer | We will board in ten minutes.
departure | départ | Check the departure board.
arrival | arrivée | The arrival hall is downstairs.
window seat | place côté hublot | I prefer a window seat.
aisle seat | place côté couloir | Can I have an aisle seat?
customs | douane | We went through customs.
land | atterrir | The plane will land at noon.
take off | décoller | The plane will take off soon.`,
    `
Can I have a window seat, please? | Puis-je avoir une place côté hublot ?
The flight will be delayed by an hour. | Le vol aura une heure de retard.
Where is gate B12? | Où est la porte B12 ?
I'll carry your bag. | Je vais porter ton sac.
We will board in twenty minutes. | Nous embarquerons dans vingt minutes.`,
    "Raconte un passage à l'aéroport (réel ou imaginé), puis écris en anglais ce qui va se passer pendant ton prochain vol avec will.",
  ),
  L(
    'À la gare',
    'Acheter un billet et comprendre les annonces.',
    'a2-simple-vs-continuous',
    `
station | gare | The station is crowded today.
platform | quai | The train leaves from platform three.
ticket office | guichet | The ticket office opens at six.
single | aller simple | A single to Brighton, please.
return | aller-retour | A return ticket costs twenty pounds.
timetable | horaires | Check the timetable.
leave | partir | The train leaves at ten.
arrive | arriver | It arrives at noon.
change | changer (de train) | You change at Leeds.
direct | direct | Is there a direct train?
seat | place | Is this seat taken?
carriage | voiture (de train) | Our seats are in carriage C.
announcement | annonce | Listen to the announcement.
running late | en retard | The train is running late.
waiting | en train d'attendre | We are waiting on the platform.
passenger | passager | The passengers are getting on.
fare | prix du billet | The fare is cheap on Sundays.
connection | correspondance | I missed my connection.
rush hour | heure de pointe | Trains are full at rush hour.
strike | grève | There is a strike today.`,
    `
A return ticket to York, please. | Un aller-retour pour York, s'il vous plaît.
What time does the next train leave? | À quelle heure part le prochain train ?
The train is running ten minutes late. | Le train a dix minutes de retard.
Do I need to change? | Dois-je changer ?
Is this seat free? | Cette place est libre ?`,
    "Décris ton trajet habituel en train ou en bus (présent simple) puis ce qui se passe aujourd'hui (présent continu).",
  ),
  L(
    'Louer une voiture',
    'Louer un véhicule et comprendre les conditions.',
    'a2-will',
    `
rent | louer | We will rent a car.
driving licence | permis de conduire | Can I see your driving licence?
insurance | assurance | Insurance is included.
deposit | caution | You pay a deposit of 300 euros.
petrol | essence | The tank is full of petrol.
diesel | diesel | It is a diesel car.
automatic | automatique | I want an automatic car.
manual | manuelle | Manual cars are cheaper.
tank | réservoir | Return the car with a full tank.
key | clé | Here are the keys.
damage | dégâts | Check the car for damage.
scratch | rayure | There is a scratch on the door.
return | rendre | Return the car on Sunday.
pick up | récupérer | You can pick up the car at the airport.
GPS | GPS | Does it have a GPS?
motorway | autoroute | Take the motorway.
speed limit | limitation de vitesse | The speed limit is 90.
park | se garer | Where can I park?
toll | péage | There is a toll on this road.
breakdown | panne | In case of breakdown, call this number.`,
    `
I'd like to rent a car for a week. | Je voudrais louer une voiture pour une semaine.
Is insurance included? | L'assurance est-elle comprise ?
I'll return it on Friday. | Je la rendrai vendredi.
There's a scratch on the door. | Il y a une rayure sur la portière.
Where can I park? | Où puis-je me garer ?`,
    'Prépare un road trip imaginaire : écris en français ton itinéraire, puis traduis avec will (we will rent, we will drive…).',
  ),
  L(
    'Chercher un appartement',
    'Comparer des logements et poser des questions.',
    'a2-comparatives',
    `
flat | appartement | This flat is bigger than the other one.
rent | loyer | The rent is too high.
landlord | propriétaire | The landlord is nice.
tenant | locataire | The tenants are students.
furnished | meublé | Is the flat furnished?
bedroom | chambre | It has two bedrooms.
bills | charges, factures | Bills are not included.
area | quartier | It is a quiet area.
bright | lumineux | The living room is bright.
dark | sombre | The kitchen is a bit dark.
spacious | spacieux | The flat is spacious.
noisy | bruyant | This street is noisier.
cheaper | moins cher | The second flat is cheaper.
closer | plus proche | It is closer to my work.
modern | moderne | The kitchen is more modern.
visit | visiter | Can I visit the flat?
contract | bail, contrat | Sign the contract here.
available | disponible | It is available in June.
advert | annonce | I saw your advert online.
share | colocation, partager | I share a flat with two friends.`,
    `
Is the flat still available? | L'appartement est-il toujours disponible ?
How much is the rent? | Combien est le loyer ?
Are bills included? | Les charges sont-elles comprises ?
This one is brighter than the first. | Celui-ci est plus lumineux que le premier.
Can I visit it this week? | Puis-je le visiter cette semaine ?`,
    'Compare ton logement actuel avec ton logement idéal en français, puis traduis avec au moins 6 comparatifs.',
  ),
  L(
    'Déménager',
    'Organiser un déménagement.',
    'a2-going-to',
    `
move | déménager | We are going to move in May.
box | carton | We need more boxes.
pack | emballer | I am going to pack tonight.
unpack | déballer | We will unpack tomorrow.
van | camionnette | We are going to rent a van.
furniture | meubles | The furniture is heavy.
carry | porter | Can you help me carry this?
fragile | fragile | Careful, it is fragile.
address | adresse | What is your new address?
neighbourhood | quartier | We are going to love the neighbourhood.
utility | service (eau, gaz…) | Call the utility companies.
paint | peindre | We are going to paint the walls.
key | clé | We get the keys on Friday.
empty | vide | The old flat is empty now.
heavy | lourd | This box is very heavy.
help | aider | My friends are going to help me.
stressful | stressant | Moving is stressful.
settle in | s'installer | We are settling in slowly.
mess | désordre | The flat is a mess.
label | étiqueter | Label every box.`,
    `
We're going to move next month. | Nous allons déménager le mois prochain.
Can you help me carry the sofa? | Tu peux m'aider à porter le canapé ?
Careful, this box is fragile! | Attention, ce carton est fragile !
What's your new address? | Quelle est ta nouvelle adresse ?
We're slowly settling in. | Nous nous installons petit à petit.`,
    'Imagine que tu déménages le mois prochain : écris en français ce que tu vas faire, puis traduis avec going to.',
  ),
  L(
    'Un petit accident',
    'Raconter un accident ou une blessure.',
    'a2-past-irregular',
    `
accident | accident | I had an accident yesterday.
fell | suis tombé (fall) | I fell off my bike.
broke | ai cassé (break) | She broke her arm.
hurt | me suis fait mal | I hurt my knee.
cut | me suis coupé | I cut my finger.
burn | brûlure, se brûler | I burnt my hand on the oven.
bleed | saigner | My nose started to bleed.
bruise | bleu (ecchymose) | I have a big bruise.
plaster | pansement | Put a plaster on it.
bandage | bandage | The nurse put a bandage on my leg.
ambulance | ambulance | They called an ambulance.
emergency | urgence | We went to the emergency room.
x-ray | radio | They did an x-ray.
slipped | ai glissé | I slipped on the ice.
painful | douloureux | It was very painful.
careful | prudent | Be careful!
injured | blessé | Two people were injured.
crash | collision | There was a crash on the motorway.
lucky | chanceux | I was lucky.
swollen | enflé | My ankle is swollen.`,
    `
What happened? | Que s'est-il passé ?
I slipped and fell on the stairs. | J'ai glissé et je suis tombé dans l'escalier.
Does it hurt? | Ça fait mal ?
She broke her leg skiing. | Elle s'est cassé la jambe au ski.
You were lucky! | Tu as eu de la chance !`,
    "Raconte un petit accident qui t'est arrivé (ou à quelqu'un) en français, puis traduis-le au prétérit.",
  ),
  L(
    'Le sport et la forme',
    'Parler de son activité physique et de sa fréquence.',
    'a2-adverbs-frequency',
    `
exercise | exercice, faire du sport | I exercise three times a week.
gym | salle de sport | I go to the gym after work.
run | courir | I run every morning.
jog | faire du jogging | We jog in the park.
fit | en forme | I want to be fit.
healthy | sain | Sport keeps you healthy.
muscle | muscle | Exercise builds muscle.
stretch | s'étirer | Always stretch after running.
yoga | yoga | I do yoga on Sundays.
swimming | natation | Swimming is good for your back.
cycling | vélo | Cycling is my favourite sport.
sweat | transpirer | I sweat a lot at the gym.
tired | fatigué | I am always tired after training.
often | souvent | I often go swimming.
sometimes | parfois | I sometimes play tennis.
rarely | rarement | I rarely miss a session.
once a week | une fois par semaine | I play football once a week.
twice | deux fois | I go running twice a week.
coach | coach | My coach is very motivating.
lazy | paresseux | I am too lazy to exercise.`,
    `
How often do you exercise? | À quelle fréquence fais-tu du sport ?
I go to the gym twice a week. | Je vais à la salle deux fois par semaine.
I never run in the rain. | Je ne cours jamais sous la pluie.
She's always full of energy. | Elle est toujours pleine d'énergie.
I should exercise more. | Je devrais faire plus de sport.`,
    'Décris ta semaine sportive (ou ton manque de sport !) avec always, often, sometimes, never et once/twice a week.',
  ),
  L(
    'Manger sainement',
    "Parler d'alimentation et de quantités.",
    'a2-quantity',
    `
diet | alimentation, régime | I have a healthy diet.
healthy | sain | Fruit is healthy.
junk food | malbouffe | I eat too much junk food.
vegetables | légumes | Eat more vegetables.
protein | protéine | Fish is full of protein.
sugar | sucre | There is too much sugar in soda.
fat | gras, graisse | This dish has a lot of fat.
salt | sel | Don't put too much salt.
fibre | fibres | Bread contains fibre.
vitamin | vitamine | Oranges contain vitamin C.
portion | portion | The portions are huge.
snack | en-cas | I have a snack at four.
meal | repas | I eat three meals a day.
vegan | végan | My sister is vegan.
organic | bio | I buy organic eggs.
calories | calories | This cake has a lot of calories.
balanced | équilibré | Try to have a balanced diet.
a few | quelques | I eat a few nuts every day.
a little | un peu de | Add a little olive oil.
too much | trop de | I drink too much coffee.`,
    `
How much water do you drink a day? | Combien d'eau bois-tu par jour ?
I don't eat much meat. | Je ne mange pas beaucoup de viande.
There's too much sugar in this. | Il y a trop de sucre là-dedans.
I try to eat a lot of vegetables. | J'essaie de manger beaucoup de légumes.
Would you like some fruit? | Veux-tu des fruits ?`,
    'Décris ce que tu manges en une journée et ce que tu voudrais changer, avec much, many, a lot of, a few, a little.',
  ),
  L(
    'Suivre une recette',
    'Les quantités, les étapes et les ustensiles.',
    'a2-quantity',
    `
recipe | recette | This recipe is easy.
ingredient | ingrédient | You need five ingredients.
flour | farine | Add two hundred grams of flour.
butter | beurre | Melt the butter.
egg | œuf | Beat the egg.
pinch | pincée | Add a pinch of salt.
spoonful | cuillerée | Add a spoonful of sugar.
mix | mélanger | Mix everything together.
stir | remuer | Stir the soup.
chop | hacher | Chop the onion.
slice | trancher | Slice the tomato.
pour | verser | Pour the milk.
heat | chauffer | Heat the oil in a pan.
bake | cuire au four | Bake for thirty minutes.
boil | faire bouillir | Boil the pasta.
melt | faire fondre | Melt the chocolate.
taste | goûter | Taste the sauce.
serve | servir | Serve hot.
some | du, de la, des | Add some cheese.
enough | assez | Is there enough sugar?`,
    `
How much flour do I need? | Combien de farine me faut-il ?
Add a pinch of salt. | Ajoute une pincée de sel.
Stir it for five minutes. | Remue pendant cinq minutes.
Is there enough milk? | Y a-t-il assez de lait ?
It smells delicious! | Ça sent délicieusement bon !`,
    "Écris la recette d'un plat de ta famille en français, puis traduis-la avec des quantités (some, a little, a few, 200 grams of).",
  ),
  L(
    'Les projets du week-end',
    "Dire ce que l'on va faire.",
    'a2-going-to',
    `
plan | projet, prévoir | What are your plans for Saturday?
weekend | week-end | I'm going to relax this weekend.
invite | inviter | I'm going to invite some friends.
barbecue | barbecue | We are going to have a barbecue.
concert | concert | We are going to a concert.
exhibition | exposition | I'm going to see an exhibition.
hike | randonnée | We are going to hike in the mountains.
redecorate | refaire la déco | We are going to redecorate the bedroom.
nothing | rien | I'm going to do nothing!
stay in | rester à la maison | I'm going to stay in tonight.
go out | sortir | Are you going to go out?
book | réserver | I'm going to book a table.
visit | rendre visite | We are going to visit my aunt.
early | tôt | I'm going to get up early.
lie in | faire la grasse matinée | I'm going to lie in on Sunday.
busy | occupé | It's going to be a busy weekend.
tired | fatigué | I'm going to be tired.
forecast | prévisions | The forecast says it's going to rain.
maybe | peut-être | Maybe we are going to the beach.
decide | décider | We haven't decided yet.`,
    `
What are you going to do this weekend? | Que vas-tu faire ce week-end ?
I'm going to stay in and relax. | Je vais rester à la maison et me détendre.
We're going to have a barbecue. | Nous allons faire un barbecue.
It's going to rain on Sunday. | Il va pleuvoir dimanche.
Are you going to come with us? | Vas-tu venir avec nous ?`,
    'Écris ton programme du week-end prochain en français, puis traduis-le avec going to (au moins 6 phrases).',
  ),
  L(
    'Inviter, accepter, refuser',
    'Proposer une sortie et répondre poliment.',
    'a2-will',
    `
invite | inviter | I'd like to invite you to dinner.
invitation | invitation | Thanks for the invitation.
would you like | voudrais-tu | Would you like to come?
accept | accepter | I accept with pleasure.
refuse | refuser | I'm sorry, I have to refuse.
free | libre | Are you free on Friday?
busy | pris | I'm busy on Saturday.
another time | une autre fois | Maybe another time.
sounds great | ça a l'air génial | That sounds great!
pick up | passer prendre | I'll pick you up at eight.
bring | apporter | I'll bring a dessert.
promise | promettre | I promise I'll come.
late | en retard | Sorry, I'll be a bit late.
dress code | tenue exigée | Is there a dress code?
host | hôte | Our host was very kind.
guest | invité | We have ten guests.
excuse | excuse | That's a good excuse!
unfortunately | malheureusement | Unfortunately, I can't come.
let me know | tiens-moi au courant | Let me know if you can come.
looking forward | avoir hâte | I'm looking forward to it.`,
    `
Would you like to come for dinner on Saturday? | Voudrais-tu venir dîner samedi ?
I'd love to! | Avec plaisir !
I'm afraid I can't, I'm busy. | J'ai bien peur de ne pas pouvoir, je suis pris.
I'll bring a bottle of wine. | J'apporterai une bouteille de vin.
Maybe another time? | Peut-être une autre fois ?`,
    'Écris une invitation à une fête en français, puis trois réponses en anglais : une qui accepte, une qui refuse, une qui hésite (avec will).',
  ),
  L(
    'Fêtes et traditions',
    'Décrire des traditions et ce qui se passe en ce moment.',
    'a2-simple-vs-continuous',
    `
tradition | tradition | It is an old tradition.
festival | festival, fête | The festival takes place in July.
celebrate | célébrer | We celebrate the new year in January.
costume | costume, déguisement | The children wear costumes.
parade | défilé | The parade is passing now.
fireworks | feu d'artifice | We watch the fireworks.
decorate | décorer | We decorate the house.
custom | coutume | It is a local custom.
religious | religieux | It is a religious festival.
meal | repas | Families share a big meal.
gift | cadeau | We exchange gifts.
candle | bougie | We light candles.
dance | danse | People dance in the streets.
crowd | foule | The crowd is cheering.
every year | chaque année | We go every year.
right now | en ce moment | People are dancing right now.
national | national | It is a national holiday.
lantern | lanterne | They are hanging lanterns.
music | musique | The music is playing.
wish | souhait, souhaiter | We wish everyone a happy new year.`,
    `
How do you celebrate the new year in your country? | Comment fêtez-vous le Nouvel An dans ton pays ?
Every year we eat together. | Chaque année, nous mangeons ensemble.
Look, the parade is starting! | Regarde, le défilé commence !
People are dancing in the streets. | Les gens dansent dans les rues.
It's a national holiday. | C'est un jour férié.`,
    "Décris une fête traditionnelle de ton pays (ce qu'on fait chaque année) puis imagine que tu y es (présent continu).",
  ),
  L(
    'La mode',
    'Comparer les styles et les vêtements.',
    'a2-comparatives',
    `
fashion | mode | She loves fashion.
fashionable | à la mode | This coat is very fashionable.
style | style | I like your style.
trendy | tendance | That shop is trendy.
casual | décontracté | I prefer casual clothes.
elegant | élégant | This dress is more elegant.
comfortable | confortable | Trainers are more comfortable.
smart | chic | Wear something smart.
old-fashioned | démodé | That jacket is old-fashioned.
brand | marque | It is an expensive brand.
designer | créateur | It is a designer bag.
tight | serré | These jeans are tighter.
loose | ample | I prefer loose clothes.
leather | cuir | A leather jacket.
silk | soie | A silk scarf.
pattern | motif | I like this pattern.
striped | rayé | A striped shirt.
plain | uni | A plain T-shirt.
better | mieux | The blue one looks better.
worse | pire | That colour is worse.`,
    `
Which one looks better on me? | Lequel me va le mieux ?
This jacket is more comfortable than that one. | Cette veste est plus confortable que celle-là.
I prefer casual clothes. | Je préfère les vêtements décontractés.
That's very fashionable at the moment. | C'est très à la mode en ce moment.
It's cheaper than in the other shop. | C'est moins cher que dans l'autre magasin.`,
    "Compare ton style d'il y a dix ans avec ton style d'aujourd'hui, en français puis en anglais, avec au moins 6 comparatifs.",
  ),
  L(
    'Le shopping en ligne',
    'Commander, être livré et retourner un article.',
    'a2-past-regular',
    `
online | en ligne | I ordered a jacket online.
ordered | ai commandé | I ordered it on Monday.
delivered | livré | It was delivered on Friday.
delivery | livraison | Delivery is free.
returned | retourné | I returned the shoes.
parcel | colis | My parcel arrived yesterday.
tracked | suivi | I tracked my parcel.
basket | panier | Add it to your basket.
checkout | paiement | Go to checkout.
account | compte | Create an account.
review | avis | I read the reviews.
refund | remboursement | I received a refund.
damaged | abîmé | The box was damaged.
discount code | code promo | I used a discount code.
cancelled | annulé | I cancelled my order.
received | reçu | I received an email.
password | mot de passe | I changed my password.
website | site | The website is easy to use.
size | taille | I checked the size guide.
waited | ai attendu | I waited two weeks.`,
    `
I ordered it online last week. | Je l'ai commandé en ligne la semaine dernière.
The parcel arrived damaged. | Le colis est arrivé abîmé.
I'd like to return this item. | Je voudrais retourner cet article.
When will I receive my refund? | Quand recevrai-je mon remboursement ?
Delivery is free over 50 euros. | La livraison est gratuite au-delà de 50 euros.`,
    'Raconte un achat en ligne (réussi ou raté) en français, puis traduis-le avec des verbes réguliers au prétérit (ordered, delivered, returned).',
  ),
  L(
    'La technologie au quotidien',
    "Ce que l'on fait en ce moment avec ses appareils.",
    'a2-continuous',
    `
smartphone | smartphone | My smartphone is new.
tablet | tablette | My son is using the tablet.
charging | en charge | My phone is charging.
downloading | en train de télécharger | I'm downloading a film.
update | mise à jour | The app is updating.
screen | écran | I'm cleaning the screen.
battery | batterie | The battery is dying.
headphones | écouteurs | She is wearing headphones.
streaming | regarder en streaming | We are streaming a series.
video call | appel vidéo | I'm on a video call.
message | message | He is typing a message.
notification | notification | I'm getting too many notifications.
device | appareil | How many devices do you have?
wireless | sans fil | The mouse is wireless.
speaker | enceinte | The speaker is playing music.
camera | appareil photo, caméra | I'm using the camera.
working | en train de fonctionner | The printer isn't working.
crash | planter | My laptop keeps crashing.
connect | connecter | I'm connecting to the wifi.
search | chercher | I'm searching for a recipe.`,
    `
Sorry, I'm on a video call. | Désolé, je suis en appel vidéo.
My phone is charging. | Mon téléphone est en charge.
The wifi isn't working. | Le wifi ne fonctionne pas.
What are you watching? | Que regardes-tu ?
I'm downloading the update. | Je télécharge la mise à jour.`,
    'Décris ce que chaque membre de ta famille fait en ce moment avec ses écrans (présent continu), puis traduis.',
  ),
  L(
    'Les réseaux sociaux',
    'Habitudes et activité sur les réseaux.',
    'a2-simple-vs-continuous',
    `
social media | réseaux sociaux | I use social media every day.
post | publier, publication | I post photos on Sunday.
share | partager | She shares a lot of videos.
like | aimer (mention) | He likes all my photos.
follow | suivre | I follow a lot of artists.
follower | abonné | She has many followers.
comment | commentaire | I read the comments.
profile | profil | Update your profile picture.
story | story | I'm watching her story.
selfie | selfie | They are taking a selfie.
viral | viral | The video is going viral.
influencer | influenceur | He is a famous influencer.
scroll | faire défiler | I scroll for hours.
hashtag | hashtag | Use this hashtag.
private | privé | My account is private.
block | bloquer | You can block that person.
fake | faux | That news is fake.
addicted | accro | I'm a bit addicted.
online | en ligne | She is online right now.
offline | hors ligne | I'm going offline for a week.`,
    `
I usually post on Sundays. | Je publie d'habitude le dimanche.
She's posting a video right now. | Elle est en train de publier une vidéo.
Do you follow her? | Tu la suis ?
I spend too much time on my phone. | Je passe trop de temps sur mon téléphone.
That video is going viral. | Cette vidéo devient virale.`,
    'Décris tes habitudes sur les réseaux sociaux (présent simple) et ce que tu y vois en ce moment (présent continu).',
  ),
  L(
    'Décrire son poste',
    'Parler de ses tâches et de ses projets actuels.',
    'a2-simple-vs-continuous',
    `
job | emploi | I like my job.
duty | tâche, mission | My main duty is customer service.
responsible | responsable | I'm responsible for sales.
customer | client | I help customers every day.
manage | gérer | She manages a team of ten.
deal with | s'occuper de | I deal with complaints.
organise | organiser | I organise meetings.
currently | actuellement | I'm currently working on a big project.
project | projet | We are working on a new project.
deadline | échéance | The deadline is next week.
shift | poste (horaires) | I work the night shift.
overtime | heures sup | I often work overtime.
salary | salaire | My salary is fair.
part-time | à temps partiel | She works part-time.
full-time | à temps plein | I work full-time.
contract | contrat | I have a permanent contract.
training | formation | I'm doing a training course.
staff | personnel | We have fifty staff.
department | service | Which department are you in?
task | tâche | I have many tasks today.`,
    `
What does your job involve? | En quoi consiste ton travail ?
I'm responsible for the accounts. | Je suis responsable de la comptabilité.
At the moment I'm working on a new website. | En ce moment je travaille sur un nouveau site.
I usually start at eight. | Je commence d'habitude à huit heures.
She works part-time. | Elle travaille à temps partiel.`,
    'Décris ton travail : tes tâches habituelles (présent simple) et ton projet actuel (présent continu). Traduis-le.',
  ),
  L(
    'Chercher un emploi',
    "Les étapes d'une recherche d'emploi.",
    'a2-going-to',
    `
job offer | offre d'emploi | I saw a great job offer.
apply | postuler | I'm going to apply for this job.
CV | CV | I'm going to update my CV.
cover letter | lettre de motivation | Write a short cover letter.
interview | entretien | I have an interview on Monday.
experience | expérience | I have three years of experience.
skill | compétence | List your skills.
qualification | diplôme | What are your qualifications?
salary | salaire | The salary is good.
company | entreprise | It is a big company.
candidate | candidat | There are many candidates.
recruiter | recruteur | The recruiter called me.
hire | embaucher | They are going to hire two people.
reference | référence | Can you give me a reference?
nervous | nerveux | I'm nervous about the interview.
prepare | préparer | I'm going to prepare my answers.
strength | point fort | What are your strengths?
available | disponible | I'm available immediately.
career | carrière | I want to change my career.
unemployed | au chômage | I've been unemployed for a month.`,
    `
I'm going to apply for this position. | Je vais postuler à ce poste.
I have an interview tomorrow. | J'ai un entretien demain.
Could you tell me about your experience? | Pouvez-vous me parler de votre expérience ?
I'm available immediately. | Je suis disponible immédiatement.
I'm going to update my CV tonight. | Je vais mettre à jour mon CV ce soir.`,
    "Imagine que tu cherches un nouvel emploi : écris ton plan d'action en français, puis traduis avec going to.",
  ),
  L(
    'Ville ou campagne ?',
    'Comparer la vie urbaine et rurale.',
    'a2-comparatives',
    `
city | ville | The city is noisier than the countryside.
countryside | campagne | The countryside is quieter.
village | village | The village is smaller.
noisy | bruyant | The city is noisy.
peaceful | paisible | The countryside is more peaceful.
pollution | pollution | There is more pollution in the city.
traffic | circulation | Traffic is worse in the city.
nature | nature | I miss nature.
convenient | pratique | The city is more convenient.
expensive | cher | Life is more expensive in the city.
lively | animé | The city is livelier.
boring | ennuyeux | The village is more boring.
safe | sûr | The countryside is safer.
transport | transports | Public transport is better in the city.
job | emploi | There are more jobs in the city.
space | espace | You have more space in the countryside.
neighbour | voisin | Neighbours are friendlier in villages.
stressful | stressant | City life is more stressful.
fresh | frais | The air is fresher.
crowded | bondé | The city is more crowded.`,
    `
I prefer the countryside because it's quieter. | Je préfère la campagne car c'est plus calme.
Life in the city is more expensive. | La vie en ville est plus chère.
The air is fresher in the mountains. | L'air est plus frais en montagne.
There's less traffic in my village. | Il y a moins de circulation dans mon village.
The city is more convenient for work. | La ville est plus pratique pour le travail.`,
    'Ville ou campagne ? Donne ton avis avec au moins 8 comparatifs, en français puis en anglais.',
  ),
];
