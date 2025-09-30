-- First, clear existing content
TRUNCATE TABLE bylaws;

-- Insert complete bylaws content
INSERT INTO bylaws (section_number, title, content) VALUES
(1, 'Navn, hjemsted, formål', '<div class="prose">
  <ol>
    <li>Foreningens navn er: GRUNDEJERFORENINGEN ENGBAKKEN.</li>
    <li>Foreningens hjemsted er: Viborg Kommune.</li>
    <li>Grundejerforeningens formål er, at varetage medlemmernes nuværende og fremtidige fælles interesser af enhver art i det pågældende område.</li>
    <li>Vedligeholdelse af beplantning og græs på fællesarealerne påhviler grundejerforeningen.</li>
    <li>Udgifterne til snerydning samt vejvedligehold afholdes for delområde I''s vedkommende af ejerne i delområde I i fællesskab, og for delområde II afholdes disse udgifter af ejerne i delområde II.</li>
    <li>Grundejerforeningen er berettiget til at fremskaffe og administrere de midler, der skal anvendes til realisering af foreningens formål.</li>
    <li>De af foreningen trufne bestemmelser er bindende for medlemmerne.</li>
    <li>Foreningen skal tage skøde på eventuelle fællesarealer, veje, stier m.v.</li>
    <li>Foreningen afholder omkostningerne herved. Værdien sættes til 0 kr.</li>
    <li>Bestyrelsen kan udfærdige ordensreglement, der kræver 2/3 flertal på generalforsamling.</li>
  </ol>
</div>'),
(2, 'Medlemmer og deres forhold til foreningen', '<div class="prose">
  <ol start="4">
    <li>Medlemmer er ejere i delområde I. Grunde i delområde II kan tilbydes medlemskab årligt.</li>
    <li>Ved ejerskifte ophører medlemskab. Ny ejer overtager rettigheder og forpligtelser.</li>
    <li>Ejerskifte skal anmeldes til kasserer med oplysninger om ny ejer.</li>
    <li>Medlemmer hæfter ikke solidarisk, men pro rata i forhold til foreningen.</li>
    <li>Indskud og årligt kontingent betales pr. grund.</li>
    <li>Betaling skal ske senest 1. oktober. Regnskabsår er 1. juli – 30. juni.</li>
    <li>Ved restance over 1 måned kan beløb inddrives retsligt. Medlem mister stemmeret.</li>
  </ol>
</div>'),
(3, 'Generalforsamlingen', '<div class="prose">
  <ol start="7">
    <li>Generalforsamlingen er foreningens højeste myndighed.</li>
    <li>Afholdes årligt senest i september. Indkaldes med 3 ugers varsel. Forslag skal være bestyrelsen i hænde 14 dage før.</li>
    <li>Endelig dagsorden og forslag udsendes ca. én uge før. Dagsorden:
      <ol type="a">
        <li>Valg af dirigent og referent</li>
        <li>Bestyrelsens beretning</li>
        <li>Regnskab</li>
        <li>Forslag fra medlemmer</li>
        <li>Bidrag til vejfond</li>
        <li>Fastsættelse af bidrag</li>
        <li>Valg til bestyrelsen</li>
        <li>Kassererens honorar</li>
        <li>Valg af bilagskontrollanter og suppleanter</li>
        <li>Eventuelt</li>
      </ol>
    </li>
    <li>Ekstraordinær generalforsamling indkaldes efter behov eller ved begæring fra 1/4 af medlemmerne. Skal afholdes inden 6 uger.</li>
    <li>Hver grund giver én stemme. Skriftlig fuldmagt kan gives. Afgørelser træffes ved simpelt flertal, undtagen i særlige tilfælde.</li>
    <li>Beslutninger om f.eks. ændring af vedtægter, anvendelse af fællesarealer m.v. kræver 2/3 flertal. Ændring af solidarisk hæftelse kræver enstemmighed.</li>
    <li>Vejfond oprettes og administreres af bestyrelsen. Midler må kun bruges til formålet.</li>
  </ol>
</div>'),
(4, 'Bestyrelsen', '<div class="prose">
  <ol start="12">
    <li>Består af 5 medlemmer. Konstituerer sig selv. Valg sker løbende.</li>
    <li>Udeblivelse fra 3 møder uden grund kan medføre udskiftning. Bestyrelsen kan supplere sig selv ved behov.</li>
    <li>Bestyrelsen leder foreningen og kan ansætte folk. Arbejdsdage kan indkaldes frivilligt.</li>
    <li>Protokol føres. Beslutninger kræver flertal. Formandens stemme er afgørende ved lighed.</li>
    <li>Foreningen tegnes af flertal i bestyrelsen eller af formand og kasserer.</li>
  </ol>
</div>'),
(5, 'Bilagskontrollanter og regnskab', '<div class="prose">
  <ol start="15">
    <li>2 bilagskontrollanter og 2 suppleanter vælges. Gennemgår regnskabet og udfører mindst én uanmeldt kontrol årligt.</li>
    <li>Regnskabsår: 1/7 – 30/6. Regnskabet skal udsendes før generalforsamlingen med revisionspåtegning.</li>
    <li>Midler indsættes i foreningens navn. Hævninger foretages af kasserer med formand eller næstformand.</li>
  </ol>
</div>'),
(6, 'Opløsning', '<div class="prose">
  <ol start="18">
    <li>Kan kun ske med forslag fra bestyrelsen eller 1/2 af medlemmerne og vedtages efter reglerne for vedtægtsændringer. Kræver samtykke fra deklarationens påtaleberettigede.</li>
  </ol>
</div>'),
(7, 'Særlige bestemmelser', '<div class="prose">
  <ol start="19">
    <li>Spørgsmål, der ikke er dækket af vedtægterne, afgøres af bestyrelsen og forelægges generalforsamlingen.</li>
    <li>Vedtægter må ikke være i strid med deklarationer eller kommunale bestemmelser.</li>
  </ol>
</div>'),
(8, 'Godkendelse', '<div class="prose">
  <ol start="21">
    <li>Udgifter til stiftelsen betales af foreningen.</li>
  </ol>
  <p>Vedtaget den 05.09.1987.</p>
  <p>Ændret: 29.09.1992, 22.09.1998, 30.09.2014 og 20.09.2022.</p>
</div>');