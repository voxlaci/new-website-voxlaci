const ramosEditions = {
  2005:["Walter Bially","Germany","ramos-2005.jpg","The first Ramos cycle began an international tradition of sacred choral music in Portugal."],
  2006:["Joel Thomas","Great Britain","ramos-2006.jpg","The second edition consolidated the meeting between VoxLaci singers and international conducting traditions."],
  2007:["Branka Potočnik","Slovenia","ramos-2007.jpg","The third edition expanded the festival's European artistic dialogue."],
  2008:["Frankie Wai","China","ramos-2008.jpg","The fourth edition connected Portuguese singers with an Asian conducting perspective."],
  2009:["Vincenzo Scarafile","Italy","ramos-2009.jpg","The fifth edition explored sacred repertoire through Italian musical tradition."],
  2010:["David A. McConnell","USA","ramos-2010.jpg","The sixth edition began a continuing artistic relationship with American conductor David A. McConnell."],
  2011:["Jean-Marie Puissant","France","ramos-2011.jpg","The seventh edition brought French choral experience to Cascais and Lisbon."],
  2012:["Marta Jacubiec","Poland","ramos-2012.jpg","The eighth edition connected the festival with Polish choral culture."],
  2013:["Raimon Romaní","Spain","ramos-2013.jpg","The ninth edition continued Ramos as a meeting place for Iberian and international voices."],
  2014:["Virginia Bono","Argentina","ramos-2014.jpg","The tenth edition marked a decade of transformation through music and international exchange."],
  2017:["Ivan Moody","United Kingdom / Portugal","ramos-2017.jpg","The eleventh edition explored contemporary sacred music and the expressive power of text."],
  2018:["Eric Banks","USA","ramos-2018.jpg","The twelfth edition included The Palms No. 2 — Una Palmera and new international repertoire."],
  2019:["Vladimir Silva","Brazil","ramos-2019.jpg","The thirteenth edition connected Palm Sunday repertoire with Brazilian choral energy."],
  2021:["Myguel Santos e Castro","Portugal","default.jpg","A special edition shaped by resilience and artistic adaptation during the pandemic."],
  2022:["Donka Miteva","Bulgaria / Germany","default.jpg","The fifteenth edition marked the return to shared rehearsals, presence and international encounter."],
  2023:["Steve Scott","USA","steve-scott.jpg","The festival continued its international journey through intensive rehearsal, sacred repertoire and shared transformation."],
  2024:["David A. McConnell","USA","david-mcconnell.jpg","Pilgrimage to the Cross: a musical journey through the moments preceding Easter."],
  2025:["Myguel Santos e Castro","Portugal","myguel-2025.jpg","Sixteen works revisited the festival's history around the message Be the light and the bridge."],
  2026:["Jean Kleeb","Brazil / Germany","jean-kleeb.jpg","Behold, I make all things new: music between lament, hope, doubt and trust."],
  2027:["Felicia Barber","USA","felicia-barber-headshot.jpg","The 19th Palm Sunday Festival takes place from 15 to 21 March 2027."],
  2028:["Donald Brinegar","USA","donald-brinegar.jpg","Future guest conductor announced. Dates, repertoire and programme are to be confirmed."]
};
const ramosSummariesPt = {
  2005:"A primeira edição iniciou em Portugal uma tradição internacional de música coral sacra.",
  2006:"A segunda edição consolidou o encontro entre cantores VoxLaci e diferentes tradições de direção.",
  2007:"A terceira edição alargou o diálogo artístico europeu do festival.",
  2008:"A quarta edição ligou cantores portugueses a uma perspetiva de direção asiática.",
  2009:"A quinta edição explorou repertório sacro através da tradição musical italiana.",
  2010:"A sexta edição iniciou uma relação artística continuada com David A. McConnell.",
  2011:"A sétima edição trouxe a experiência coral francesa a Cascais e Lisboa.",
  2012:"A oitava edição ligou o festival à cultura coral polaca.",
  2013:"A nona edição continuou Ramos como lugar de encontro entre vozes ibéricas e internacionais.",
  2014:"A décima edição assinalou uma década de transformação através da música.",
  2017:"A décima primeira edição explorou música sacra contemporânea e o poder expressivo do texto.",
  2018:"A décima segunda edição incluiu The Palms N.º 2 — Una Palmera e novo repertório internacional.",
  2019:"A décima terceira edição cruzou repertório de Domingo de Ramos com energia coral brasileira.",
  2021:"Uma edição especial marcada pela resiliência e adaptação artística durante a pandemia.",
  2022:"A décima quinta edição marcou o regresso aos ensaios presenciais e ao encontro internacional.",
  2023:"O festival continuou a sua viagem internacional através de ensaio intensivo, repertório sacro e transformação partilhada.",
  2024:"Pilgrimage to the Cross: uma viagem musical pelos momentos que antecedem a Páscoa.",
  2025:"Dezasseis obras revisitaram a história do festival em torno da mensagem Sê a luz e a ponte.",
  2026:"Behold, I make all things new: música entre lamento, esperança, dúvida e confiança.",
  2027:"A 19.ª edição do Palm Sunday Festival realiza-se de 15 a 21 de março de 2027.",
  2028:"Maestro convidado anunciado. Datas, repertório e programa ainda por confirmar."
};
const editionYear = document.body.dataset.year;
const editionLanguage = document.documentElement.lang;
const edition = ramosEditions[editionYear];
if (edition) {
  const [conductor,country,image,summary] = edition;
  document.querySelectorAll("[data-year]").forEach((el)=>el.textContent=editionYear);
  document.querySelectorAll("[data-conductor]").forEach((el)=>el.textContent=conductor);
  document.querySelectorAll("[data-country]").forEach((el)=>el.textContent=country);
  const assetPrefix = editionLanguage === "en" ? "../../../assets/ramos/" : "../../assets/ramos/";
  const poster=document.querySelector("[data-poster]"); if(poster) poster.src=`${assetPrefix}${image}`;
  document.querySelector("[data-summary]").textContent=editionLanguage === "pt" ? ramosSummariesPt[editionYear] : summary;
  document.title=`Ramos ${editionYear} · ${conductor} | VoxLaci`;
}
