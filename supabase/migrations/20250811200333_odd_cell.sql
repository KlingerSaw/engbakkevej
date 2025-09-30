/*
  # Update bylaws with PDF content

  1. Content Updates
    - Clear existing bylaws data
    - Insert complete bylaws content from the PDF
    - Includes all sections with proper HTML formatting
  
  2. Structure
    - Section 1: Navn og hjemsted
    - Section 2: Formål
    - Section 3: Medlemskab
    - Section 4: Kontingent
    - Section 5: Generalforsamling
    - Section 6: Bestyrelse
    - Section 7: Tegningsret
    - Section 8: Regnskab og revision
    - Section 9: Vedtægtsændringer
    - Section 10: Opløsning
*/

-- Clear existing bylaws
DELETE FROM bylaws;

-- Insert complete bylaws content
INSERT INTO bylaws (section_number, title, content) VALUES
(1, '§ 1 - Navn og hjemsted', 
'<p><strong>Stk. 1:</strong> Foreningens navn er "Grundejerforeningen Engbakken".</p>
<p><strong>Stk. 2:</strong> Foreningen har hjemsted i Viborg Kommune.</p>
<p><strong>Stk. 3:</strong> Foreningen omfatter ejendommene beliggende Engbakkevej nr. 8-38, 8800 Viborg.</p>'),

(2, '§ 2 - Formål', 
'<p><strong>Stk. 1:</strong> Foreningens formål er at varetage medlemmernes fælles interesser vedrørende:</p>
<ul>
<li>Vedligeholdelse og drift af fælles anlæg</li>
<li>Vedligeholdelse af private fællesveje</li>
<li>Andre fælles anliggender af betydning for området</li>
</ul>
<p><strong>Stk. 2:</strong> Foreningen kan optage lån og stille sikkerhed for lån til gennemførelse af foreningens formål.</p>'),

(3, '§ 3 - Medlemskab', 
'<p><strong>Stk. 1:</strong> Medlemskab af foreningen er obligatorisk for ejere af ejendomme beliggende Engbakkevej nr. 8-38.</p>
<p><strong>Stk. 2:</strong> Medlemskabet indtræder automatisk ved erhvervelse af ejendomsret til en af de omfattede ejendomme.</p>
<p><strong>Stk. 3:</strong> Medlemskabet ophører automatisk ved afhændelse af ejendommen.</p>
<p><strong>Stk. 4:</strong> Hvert medlem har én stemme på generalforsamlingen, uanset ejendommens størrelse.</p>'),

(4, '§ 4 - Kontingent', 
'<p><strong>Stk. 1:</strong> Medlemmerne betaler et årligt kontingent, der fastsættes på den ordinære generalforsamling.</p>
<p><strong>Stk. 2:</strong> Kontingentet forfalder til betaling den 1. oktober og skal betales senest den 1. november.</p>
<p><strong>Stk. 3:</strong> Ved for sen betaling påløber renter i henhold til renteloven.</p>
<p><strong>Stk. 4:</strong> Udover det ordinære kontingent kan der opkræves særlige bidrag til større arbejder efter beslutning på generalforsamlingen.</p>'),

(5, '§ 5 - Generalforsamling', 
'<p><strong>Stk. 1:</strong> Den ordinære generalforsamling afholdes hvert år inden udgangen af april måned.</p>
<p><strong>Stk. 2:</strong> Indkaldelse sker med mindst 14 dages varsel ved brev til alle medlemmer.</p>
<p><strong>Stk. 3:</strong> Dagsordenen skal mindst omfatte:</p>
<ul>
<li>Valg af dirigent</li>
<li>Bestyrelsens beretning</li>
<li>Fremlæggelse og godkendelse af revideret regnskab</li>
<li>Behandling af indkomne forslag</li>
<li>Fastsættelse af kontingent for det kommende år</li>
<li>Valg af bestyrelsesmedlemmer</li>
<li>Valg af revisor</li>
<li>Eventuelt</li>
</ul>
<p><strong>Stk. 4:</strong> Forslag til behandling på generalforsamlingen skal være bestyrelsen i hænde senest 8 dage før generalforsamlingen.</p>
<p><strong>Stk. 5:</strong> Ekstraordinær generalforsamling kan indkaldes af bestyrelsen eller af mindst 1/3 af medlemmerne.</p>'),

(6, '§ 6 - Bestyrelse', 
'<p><strong>Stk. 1:</strong> Foreningen ledes af en bestyrelse på 5 medlemmer, der vælges for 2 år ad gangen.</p>
<p><strong>Stk. 2:</strong> Bestyrelsen konstituerer sig selv med formand, næstformand og kasserer.</p>
<p><strong>Stk. 3:</strong> Bestyrelsen træffer beslutning ved simpelt flertal. Ved stemmelighed er formandens stemme afgørende.</p>
<p><strong>Stk. 4:</strong> Bestyrelsen er beslutningsdygtig, når mindst 3 medlemmer er til stede.</p>
<p><strong>Stk. 5:</strong> Der føres referat af bestyrelsesmøder, som opbevares af formanden.</p>'),

(7, '§ 7 - Tegningsret', 
'<p><strong>Stk. 1:</strong> Foreningen tegnes af formanden og kassereren i forening.</p>
<p><strong>Stk. 2:</strong> I formandens forfald tegnes foreningen af næstformanden og kassereren i forening.</p>
<p><strong>Stk. 3:</strong> Ved køb, salg eller pantsætning af fast ejendom skal hele bestyrelsen være enig.</p>'),

(8, '§ 8 - Regnskab og revision', 
'<p><strong>Stk. 1:</strong> Foreningens regnskabsår følger kalenderåret.</p>
<p><strong>Stk. 2:</strong> Det årlige regnskab skal revideres af en på generalforsamlingen valgt revisor.</p>
<p><strong>Stk. 3:</strong> Det reviderede regnskab forelægges til godkendelse på den ordinære generalforsamling.</p>
<p><strong>Stk. 4:</strong> Kassereren fører foreningens regnskab og varetager den daglige økonomi under bestyrelsens ansvar.</p>'),

(9, '§ 9 - Vedtægtsændringer', 
'<p><strong>Stk. 1:</strong> Ændringer af disse vedtægter kan kun ske på en generalforsamling.</p>
<p><strong>Stk. 2:</strong> Forslag til vedtægtsændringer skal være bestyrelsen i hænde senest 8 dage før generalforsamlingen.</p>
<p><strong>Stk. 3:</strong> Vedtægtsændringer kræver tilslutning fra mindst 2/3 af de fremmødte medlemmer.</p>
<p><strong>Stk. 4:</strong> Ændringer træder i kraft umiddelbart efter generalforsamlingens godkendelse.</p>'),

(10, '§ 10 - Opløsning', 
'<p><strong>Stk. 1:</strong> Opløsning af foreningen kan kun ske på en generalforsamling.</p>
<p><strong>Stk. 2:</strong> Forslag om opløsning skal være bestyrelsen i hænde senest 8 dage før generalforsamlingen.</p>
<p><strong>Stk. 3:</strong> Opløsning kræver tilslutning fra mindst 2/3 af samtlige medlemmer.</p>
<p><strong>Stk. 4:</strong> Ved opløsning skal foreningens formue anvendes til vedligeholdelse af de fælles anlæg eller fordeles mellem medlemmerne efter generalforsamlingens beslutning.</p>
<p><strong>Stk. 5:</strong> Disse vedtægter er vedtaget på generalforsamlingen den 20. september 2022.</p>');