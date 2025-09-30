/*
  # Update bylaws with exact content from document

  1. Updates existing bylaws table with complete content
  2. Includes all sections exactly as written
  3. Maintains proper formatting and structure
*/

-- Clear existing bylaws
DELETE FROM bylaws;

-- Insert the complete bylaws content exactly as written
INSERT INTO bylaws (section_number, title, content) VALUES
(1, 'Navn, hjemsted, formål', 
'<p><strong>1.</strong> Foreningens navn er: GRUNDEJERFORENINGEN ENGBAKKEN.</p>
<p><strong>2.</strong> Foreningens hjemsted er: Viborg Kommune.</p>
<p><strong>3.</strong> Grundejerforeningens formål er, at varetage medlemmernes nuværende og fremtidige fælles interesser af enhver art i det pågældende område. Vedligeholdelse af beplantning og græs på fællesarealerne påhviler grundejerforeningen.</p>
<p>Udgifterne til snerydning samt vejvedligehold afholdes for delområde I''s vedkommende af ejerne i delområde I i fællesskab, og for delområde II afholdes disse udgifter af ejerne i delområde II.</p>
<p>Grundejerforeningen er berettiget til at fremskaffe og administrere de midler, der skal anvendes til realisering af foreningens formål, herunder fastsætte nærmere regler for, hvorledes medlemmerne skal betale bidrag.</p>
<p>De af foreningen til gennemførelse af nævnte foreningsformål trufne bestemmelser er fuldt bindende for de enkelte medlemmer. Foreningen er pligtig efter påkrav at tage skøde på eventuelle fællesarealer, veje, stier m.v. med derpå værende anlæg.</p>
<p>Foreningen afholder de med erhvervelsen forbundne omkostninger. Værdien af arealerne ansættes til 0 kr.</p>
<p>Foreningens bestyrelse skal være berettiget til at udfærdige et ordensreglement, der skal vedtages af en generelforsamling med 2/3 flertal.</p>'),

(2, 'Medlemmerne og disses forhold til foreningen', 
'<p><strong>4.</strong> Foreningens medlemmer er de til enhver tid værende ejere af grunde omfattet af den lokalplan nr. 11 af 17.04.79 – Viborg Kommune benævnte "Delområde I". Grundejere med grunde indenfor "Delområde II" skal tilbydes medlemskab af foreningen for et år ad gangen, men er dog ikke forpligtet til et medlemskab. Endvidere skal der være mulighed for en sammenlægning med grundejerforeningerne i naboområderne.</p>
<p>Grundejerforeningen skal være berettiget til med 2/3 majoritet af de på en generalforsamling mødende medlemmer at træffe bestemmelse om, at også ejerne af grunde uden for foreningens område kan være medlemmer af foreningen, eller at grundejerforeningen kan sluttes sammen med en anden grundejerforening.</p>
<p><strong>5.</strong> Når et medlem overdrager sin grund eller på anden måde ophører at være ejer af denne, er han fra overdragelsesdagen ophørt at være medlem af foreningen og kan intet rette mod dennes formue.</p>
<p>Den nye ejer indtræder i den tidligere ejers rettigheder og forpligtigelser, idet den tidligere ejer dog tillige vedbliver at hæfte for eventuelle restancer over for foreningen, indtil den nye ejer har berigtiget restancerne og overtaget forpligtelserne.</p>
<p>Både den tidligere og den nye ejer er pligtige at anmelde ejerskiftet til foreningen ved dennes kassere og i forbindelse hermed oplyse foreningen om den nye ejers navn, stilling og bopæl.</p>
<p><strong>6.</strong> Foreningens medlemmer hæfter i forhold til tredjemand ikke solidarisk for foreningens forpligtelser.</p>
<p>I forholdet til foreningen hæfter medlemmerne pro rata, hvilket også skal gælde for tab, som foreningen har på enkelte medlemmer. Ved foreningens oprettelse betales af hvert medlem for hver grund han ejer et indskud, der forfalder til betaling senest 2 måneder efter stiftende generalforsamling. Der skal kun betales et indskud pr. grund.</p>
<p>I øvrigt betaler hvert medlem for hver grund der ejes et årligt kontingent til foreningens administration og øvrige udgifter.</p>
<p>Beløbet opkræves af kassereren og skal indbetales senest pr. 1. oktober for indeværende regnskabsperiode.</p>
<p>Regnskabsperioden strækker sig fra 1. juli til 30. juni.</p>
<p>Det årlige kontingent fastsættes af den ordinære generalforsamling.</p>
<p>Er et medlem mere end 1 måned i restance til foreningen, kan det pågældende beløb inddrives ad retslig vej, efter at der forinden er givet medlemmet skiftlig påmindelse inden 8 dage at berigtige restancen.</p>
<p>Alle omkostninger i forbindelse med inddrivelsen betales af vedkommende restant, der endvidere skal betale et administrationstillæg for restancen, svarende til ¼ af årskontingentet.</p>
<p>Er restancen ikke indbetalt senest 8 dage før en generelforsamling fortabes retten til at stemme samt valgbarheden.</p>'),

(3, 'GENERALFORSAMLINGEN', 
'<p><strong>7.</strong> Generalforsamlingen er foreningens højest myndighed.</p>
<p><strong>8.</strong> Ordinær generalforsamling afholdes hvert år, senest med udgang af september måned. Den indkaldes af bestyrelsen med 3 ugers varsel ved skriftlig meddelelse eller som elektronisk post via grundejernes mailadresser til hvert enkelt medlem under den i medlemsprotokollen anført adresse.</p>
<p>Der påhviler hvert enkelt medlem i egen interesse at holde foreningen underrettet om enhver adresseforandring.</p>
<p>Dagsordenen, der fastsættes af bestyrelsen, skal meddeles hvert enkelt medlem samtidig med indkaldelsen.</p>
<p>Forslag, der af medlemmerne ønskes behandlet på den ordinære generalforsamlingen, skal være bestyrelsen i hænde senest 14 dage før generalforsamlingen.</p>
<p>Sager der ikke er optaget på dagordenen, kan ikke sættes under afstemning. Den endelige dagsorden bilagt eventuelle forslag udsendes ca. én uge før generalforsamlingens afholdelse. På hver ordinær generalforsamling skal følgende punkter behandles:</p>
<ol>
<li>Valg af dirigent og referent,</li>
<li>Bestyrelsens beretning om det forløbne år,</li>
<li>Aflæggelse af regnskab underskrevet af bestyrelsen og bilagskontrollanter,</li>
<li>Rettidigt indkomne forslag.</li>
<li>Fremlæggelse af bidrag til vejfond og eventuel overførsel af overskud fra sidste regnskabsår,</li>
<li>Fastsættelse af bidrag til vejfond og eventuel overførsel af overskud fra sidste regnskabsår,</li>
<li>Valg af bestyrelsesmedlemmer samt suppleanter,</li>
<li>Fastsættelse af kasserens honorar,</li>
<li>Valg af 2 bilagskontrollanter,</li>
<li>Valg af 2 bilagskontrollantsuppleanter</li>
<li>Eventuelt.</li>
</ol>
<p>Under eventuelt kan der ikke sættes forslag under afstemning.</p>
<p><strong>9.</strong> Ekstraordinær generalforsamling, der indkaldes på samme måde og med samme frist som ordinær, afholdes så ofte som bestyrelsen finder det nødvendigt, eller efter at mindst ¼ af foreningens medlemmer – der ikke er i restance til foreningen – til bestyrelsen indgiver skriftlig motiveret begæring med angivelse af dagsordenen for den ekstraordinære generalforsamling. Når sådan begæring er indgivet til bestyrelsen, skal generalforsamlingen afholdes inden 6 uger efter dennes modtagelse. Hvis ikke mindst ¾ af de medlemmer, der har ønsket den ekstraordinære generalforsamling indkaldt, er til stede på generalforsamlingen, kan dagsordenen nægtes behandlet.</p>
<p><strong>10.</strong> Generalforsamlingen vælger en dirigent, der på generalforsamlingen afgør alle tvivlsspørgsmål vedrørende sagernes behandlingsmåde og stemmeafgivningen. Hvert medlem har én stemme for hver grund medlemmet ejer.</p>
<p>Afstemning sker ved håndsoprækning, med mindre generalforsamlingen eller dirigenten finder, at en skriftlig afstemning vil være mere hensigtsmæssig.</p>
<p>Stemmeafgivning kan ske ved skriftlig fuldmagt til et andet medlem eller et medlem af vedkommendes husstand. Intet medlem kan dog afgive stemme i henhold til mere end én fuldmagt.</p>
<p>Beslutninger på generelforsamlingen træffes ved simpelt flertal, jf. dog punkt 4 og 11.</p>
<p>Over det på generalforsamlingen passerede føres en protokol, der underskrives af dirigenten og formanden. Udskrift af protokollen udsendes til medlemmerne umiddelbart efter generalforsamlingens afholdelse.</p>'),

(4, 'Vedtagelse af beslutninger og vejfond', 
'<p><strong>11.</strong> Til vedtagelse på en generalforsamling af beslutninger, der går ud på anvendelse af fællesarealer, forandring af foreningens vedtægter, ordensreglement, bevilling af midler ud over det til administrationen nødvendige, pålæg af yderligere indskud fra medlemmernes side og optagelse af lån, kræves at beslutningen vedtages med mindst 2/3 af de afgivne stemmer. Bestemmelsen om, at medlemmerne ikke hæfter solidarisk over for tredjemand kan kun ændres ved enstemmighed hos samtlige medlemmer.</p>
<p>Når der på en generalforsamling er truffet gyldig bestemmelse om bevilling af midler ud over det til administrationen nødvendige, pålæg af yderligere indskud fra medlemmernes side eller optagelse af lån, er bestyrelsen bemyndiget til at underskrive for foreningens medlemmer i ethvert forhold, der er nødvendigt til gennemførelse af generalforsamlingens beslutning.</p>
<p><strong>11a.</strong> Grundejerforeningen opretter en vejfond med det formål at vedligeholde fællesveje i delområde I. Indbetalinger til vejfonden fastlægges på den årlig generalforsamling som et årligt bidrag pr. husstand. Desuden kan generalforsamlingen beslutte at overføre eventuelt overskud fra grundejerforeningens almindelige drift.</p>
<p>Vejfondens midler indsættes på særskilt konto. Bestyrelsen råder over vejfondens midler.</p>
<p>Anvendelse af vejfondens midler til andre formål end ovennævnte kan kun ske efter beslutning på den årlige generalforsamling eller på ekstraordinær generalforsamling jf. punkt 11.</p>'),

(5, 'Bestyrelsen', 
'<p><strong>12.</strong> Bestyrelsen består af fem medlemmer og konstituerer sig selv med formand, næstformand samt kasserer. I tilfælde af formandens forfald indtræder næstformanden som formand indtil næste generalforsamling.</p>
<p>På den stiftende generalforsamling vælges 3 medlemmer til at fungere til første ordinære generalforsamling og 2 til at fungere indtil anden ordinære generalforsamling. På de følgende generalforsamlinger er således de 3, henholdsvis 2 medlemmer, der har fungeret længst på valg. På hver generalforsamling vælges endvidere 2 suppleanter.</p>
<p>Et bestyrelsesmedlem der uden lovlig grund udebliver fra tre hinanden følgende bestyrelsesmøder, må, hvis blot ét medlem af bestyrelse kræver det, udgå af bestyrelsen, og suppleanten for ham indtræder da i hans sted.</p>
<p>Dersom antallet af bestyrelsesmedlemmer ved afgang i årets løb, og efter at suppleanterne er tiltrådt, bliver mindre end tre, er bestyrelsen berettiget til at supplere sig selv indtil førstkommende generalforsamling.</p>
<p>Kasseren modtager et årligt honorar, der fastsættes af generalforsamlingen.</p>
<p>Såfremt kasseren får forfald, udpeges en midlertidig kasserer af bestyrelsen.</p>
<p><strong>13.</strong> Bestyrelsen har den daglige ledelse af foreningen virksomhed – herunder drift og vedligeholdelse af fællesanlæg – og varetager dens formål og interesser.</p>
<p>Bestyrelsen er dog berettiget til, at ansætte og bestemme aflønningen m.v. af medarbejdere til at forestå drift og vedligeholdelse af fællesanlæg.</p>
<p>Bestyrelsen kan blandt medlemmerne indkalde til frivillige arbejdsdage i forbindelse med ny-anlæg og vedligeholdelse af fællesarealser, legeplads m.v. Deltagelse i arbejdet sker på medlemmernes egen risiko og eventuelle erstatningskrav forårsaget af uheld m.m. under arbejdet er foreningen og bestyrelsen uvedkommende.</p>
<p>Der afholdes møde, så ofte formanden eller 2 medlemmer finder det nødvendigt. Over det under forhandlingerne passerede føres der protokol der skal fremlægges og godkendes af bestyrelsen på et næstfølgende bestyrelsesmøde.</p>
<p>Bestyrelsen er beslutningsdygtig når mindst tre medlemmer giver møde. Bestyrelsens beslutning træffes ved stemmeflertal. I tilfælde af stemmelighed er formandens stemme udslagsgivende.</p>'),

(6, 'Tegningsret', 
'<p><strong>14.</strong> Foreningen tegnes over for tredjemand af et flertal af bestyrelsen eller af formand og kasserer i foreningen.</p>'),

(7, 'Bilagskontrollanter og regnskab', 
'<p><strong>15.</strong> Generalforsamlingen vælger 2 bilagskontrollanter og 2 suppleanter. Genvalg kan finde sted.</p>
<p>Bilagskontrollanterne gennemgår mindst én gang årligt foreningens regnskab, der føres af kasseren efter bestyrelsens nærmere bestemmelser og forvisser sig om, at de i regnskabet opførte aktiver, er til stede hvorefter de indgiver deres revisionsbemærkninger til bestyrelsen.</p>
<p>Bilagskontrollanterne kan når som helst foretage kasseeftersyn og skal foretage en sådant uanmeldt mindst én gang årligt. Formanden og/eller kasseren er pligtig til at være tilstede ved revision.</p>
<p><strong>16.</strong> Foreningens regnskab er 1/7 til 30/6, første regnskabsår dog fra foreningens stiftelse og indtil 30/6. Regnskabet skal tilstilles bilagskontrollanterne og skal af disse være revideret såvel talmæssigt som kritisk så betids, at en ekstrakt med revisionspåtegning kan udsendes til medlemmerne samtidig med indkaldelse til generelforsamlingen.</p>
<p><strong>17.</strong> Medlemmernes indbetalinger foretages til kasseren der indsætter foreningens midler i bank eller sparekasse eller på girokonto i foreningens navn.</p>
<p>På kontoen kan kun hæves af kasseren i forbindelse med formanden eller næstformanden.</p>'),

(8, 'Opløsning', 
'<p><strong>18.</strong> Foreningens opløsning kan kun finde sted efter forslag fra bestyrelsen eller ½ af foreningens medlemmer og kan kun vedtages efter de om lovændring gældende regler. Forslaget skal indeholde bestemmelse om anvendelse af foreningens formue. Foreningen kan dog ikke opløses uden samtykke fra den påtaleberettigede i henhold til deklarationen for området.</p>'),

(9, 'Særlige bestemmelser', 
'<p><strong>19.</strong> Fremkommer der spørgsmål, hvorom disse love intet foreskriver, er bestyrelsen pligtig efter bedste evne og overbevisning at afgøre og opløse disse, men skal dog fremlægge sagen til medlemmernes godkendelse ved førstkommende generalforsamling.</p>
<p><strong>20.</strong> Ingen vedtægtsbestemmelse må være i strid med tinglyste deklarationer eller nogen kommunal vedtægt.</p>'),

(10, 'Godkendelse m.v.', 
'<p><strong>21.</strong> Samtlige udgifter i forbindelse med foreningens stiftelse betales af foreningen.</p>
<p>Ovenstående love er vedtaget på en dertil indkaldt stiftende generalforsamling den:</p>
<p><strong>Viborg den 05.09.87.</strong></p>
<p>Nærværende vedtægter er ændret på den ordinære generalforsamling den 29. september 1992 og på den ordinære generalforsamling den 22. september 1998.</p>
<p>Ændring pkt. 11 er foretaget ved ordinær generalforsamling den 30. september 2014.</p>
<p><strong>20.09.2022 – Ændringer vedtaget på ordinær generalforsamling</strong></p>
<ul>
<li>Pkt. 8 vedrørende tidspunkt for afholdelse af generalforsamling er opdateret</li>
<li>Revisorer og suppleanter ændret til bilagskontrollanter</li>
<li>Pkt. 6 opdateret med betaling en gang årligt</li>
</ul>');