class interpPhrase {
    constructor(text,id) {
        this.text = text;
        this.id = id;
    }
}

class proserDict {

    //header phrases
    static null = new interpPhrase("");
    static blankline = new interpPhrase("\r\n\r\n");
    static title = new interpPhrase("PERIPHERAL BLOOD SMEAR INTERPRETATION\r\n\r\n");
    static hxstem = new interpPhrase("CLINICAL HISTORY/REASON FOR CONSULT: The patient is a " + EHRdata.age + "yo " + EHRdata.sex + " with a PMH of ***. A consult was requested for '" + EHRdata.reasonForConsult + "'.\r\n\r\n");
    static morphstem = new interpPhrase("SMEAR MORPHOLOGY: ");
    static impressionstem = new interpPhrase("IMPRESSION: ");
    static footer = new interpPhrase("\r\n\r\nThank you for this consultation. Please contact the lab at x2931 should any additional questions arise.")

    //cytopenia phrases
    static pancytopenia = new interpPhrase("Pancytopenia is present with anemia, leukopenia, and thrombocytopenia. ");
    static bicytopeniaRW = new interpPhrase("Bicytopenia is present with anemia and leukopenia. ");
    static bicytopeniaRP = new interpPhrase("Bicytopenia is present with anemia and thrombocytopenia. ");
    static bicytopeniaWP = new interpPhrase("Bicytopenia is present with leukopenia and thrombocytopenia. ");

    //rbc phrases
    static microcytic = new interpPhrase("Microcytic, ");
    static macrocytic = new interpPhrase("Macrocytic, ");
    static normocytic = new interpPhrase("Normocytic, ");
    static hypochromic = new interpPhrase("hypochromic ");
    static hyperchromic = new interpPhrase("hyperchromic ");
    static normochromic = new interpPhrase("normochromic ");
    static anemia = new interpPhrase("anemia. ");
    static normalhgb = new interpPhrase("erythrocytes. ");
    static highrdw = new interpPhrase("Anisocytosis is present. ")
    static noschistocytes = new interpPhrase("There are no schistocytes present. ");
    static nosmearivhemolysis = new interpPhrase(" No schistocytes or microspherocytes are observed, thus there is no smear evidence of hemolysis. ");
    static hemolysiswrapper1 = new interpPhrase("There are ")
    static hemolysiswrapper2 = new interpPhrase(", which can be seen in hemolysis. ")

    // RBC dropdown
    static schistocytes = new interpPhrase("schistocytes");
    static acanthocytes = new interpPhrase("acanthocytes");
    static echinocytes= new interpPhrase("echinocytes");
    static microspherocytes = new interpPhrase("microspherocytes");
    static macrocytes = new interpPhrase("macrocytes");
    static microcytes = new interpPhrase("microcytes");
    static sicklecells = new interpPhrase("sickle cells");
    static targetcells = new interpPhrase("target cells");
    static teardropcells = new interpPhrase("teardrop cells");
    static bitecells = new interpPhrase("bite cells");
    static blistercells = new interpPhrase("blister cells");
    static howelljolly = new interpPhrase("Howell-Jolly bodies");
    static pappenheimer = new interpPhrase("Pappenheimer bodies");
    static rbcmorphtypesend = new interpPhrase(" present. ");
    
    static lowrpi = new interpPhrase("The reticulocyte production index (RPI) is <2 (" + (Math.round(EHRdata.rpi() * 100) / 100).toString() + "), indicating a hypoproliferative marrow response. ");
    static highrpi = new interpPhrase("The reticulocyte production index (RPI) is >=2 (" + (Math.round(EHRdata.rpi() * 100) / 100).toString() + "), indicating an adequate marrow response. ");
    static recretics = new interpPhrase("Ordering reticulocyte studies may help establish the etiology of the anemia. ")
    static lowmentzer = new interpPhrase("The Mentzer index is <13 (" + (Math.round(EHRdata.mentzer() * 10) / 10).toString() + "), favoring thalassemia trait over iron deficiency. ")
    static highmentzer = new interpPhrase("The Mentzer index is >13 (" + (Math.round(EHRdata.mentzer() * 10) / 10).toString() + "), favoring iron deficiency over thalassemia trait. ");
    
    
    static microcyticheader = new interpPhrase("Common causes of microcytic anemia include iron deficiency, thalassemia, and anemia of chronic disease/inflammation (ACD/AI)***. ");
    static normocyticheader = new interpPhrase("Common causes of normocytic anemia include iron deficiency, anemia of chronic disease/inflammation (ACD/AI), B12/folate deficiency, alcohol use, liver disease, hemolysis, and hypothyroidism***. ");
    static macrocyticheader = new interpPhrase("Common causes of macrocytic anemia include***. ");

    static irondefanemia = new interpPhrase("The low ferritin and high transferrin suggest iron deficiency is more likely than ACD/AI. ");
    static acd_ai = new interpPhrase("The high ferritin and low transferrin suggest ACD/AI is more likely than iron deficiency. ");
    static normaliron = new interpPhrase("Iron studies are normal making iron deficiency and ACD/AI unlikely. ");
    static inconclusiveiron = new interpPhrase("The iron studies are inconclusive. ");
    static reciron = new interpPhrase("Consider obtaining complete iron studies. ")
    static hgbep = new interpPhrase(EHRdata.hemoglobinElectrophoresis.result);

    static erythrocytosis = new interpPhrase("Erythrocytosis may be from primary causes (germline or somatic mutations driving erythrocyte production) or secondary causes including hypoxia, kidney-associated conditions, or autonomous EPO production***.");


    //wbc phrases
    static wbcnormal = new interpPhrase("Leukocytes are normal in number ");
    static wbchigh = new interpPhrase("There is leukocytosis ");
    static wbclow = new interpPhrase("There is leukopenia ");

    static nowbclineabnl = new interpPhrase("without lineage count abnormalities. ")
    static neuthigh = new interpPhrase("neutrophilia")
    static neutlow = new interpPhrase("neutropenia")
    static lymphhigh = new interpPhrase("lymphocytosis")
    static lymphlow = new interpPhrase("lymphopenia")
    static monohigh = new interpPhrase("monocytosis")
    static monolow = new interpPhrase("monocytopenia")
    static eohigh = new interpPhrase("eosinophilia")
    static eolow = new interpPhrase("eosinopenia")
    static basohigh = new interpPhrase("basophilia")
    static basolow = new interpPhrase("basopenia")

    // wbc dropdown
    static hypersegmented = new interpPhrase("hypersegmented neutrophils");
    static hyposegmented = new interpPhrase("hyposegmented neutrophils");
    static vacuolatedmono = new interpPhrase("vacuolated monocytes");
    static noparasites = new interpPhrase("no parasites");
    static wbcmorphtypesend = new interpPhrase(" present. ");


    // platelet phrases
    static pltnormal = new interpPhrase("Platelets are normal in number. ")
    static plthigh = new interpPhrase("There is thrombocytosis. ")
    static pltlow = new interpPhrase("There is thrombocytopenia. ")
	static pltsizenormalstart = new interpPhrase("There is ")
    static pltsizenormal = new interpPhrase("normal")
    static pltsizenormalend = new interpPhrase(" platelet morphology. ")
    static pltsizelarge = new interpPhrase("large")
    static pltsizegiant = new interpPhrase("giant")
    static pltsizeabnormalend = new interpPhrase(" platelets present. ")

    static ipfhigh = new interpPhrase("The immature platelet fraction is appropriately elevated given the patient's thrombocytopenia, suggesting a destructive/consumptive process. ")
    static ipfnl= new interpPhrase("The immature platelet fraction is not elevated, even though the patient has thrombocytopenia. This suggests a deficit in platelet production. ")
    static ipfration = new interpPhrase("An immature platelet fraction, which can be elevated in consumptive/destructive processes and decreased in hypoproductive states, will be measured automatically if the platelet count drops below 100 K/cmm. ")
    static ipfwrong = new interpPhrase("It is unclear why an immature platelet fraction was not performed as the platelet count is <=100 K/cmm. ")

    static thrombocytosis = new interpPhrase("Thrombocytosis can result from a reactive or myeloproliferative neoplasms (MPN). Common reactive causes include inflammation (e.g., infection, rheumatological condition, malignancy), iron deficiency, and post-splenectomy. MPNs most commonly have mutations in JAK2, CALR, or MPL (e.g., essential thrombocythemia, polycythemia vera, primary myelofibrosis)***. ")

    // tsh phrases
    static rect4 = new interpPhrase("The patient has a high TSH and no recent free T4. Suggest free T4 (thyroxine) to evalaute for hypothyroidism. ");
    static t4low = new interpPhrase("The patient has a high TSH and low free T4, which may cause a "+ EHRdata.MCV.isLow ? "microcytic" : (EHRdata.MCV.isHigh ? "macrocytic" : "normocytic") + " anemia. Thyroid replacement therapy may be warranted. ");
    static subclinicalhypothyroid = new interpPhrase("The patient has a high TSH and normal free T4 (subclinical hypothyroidism), which may cause a " + EHRdata.MCV.isLow ? "microcytic" : (EHRdata.MCV.isHigh ? "macrocytic" : "normocytic") +"anemia. Thyroid replacement therapy may be warranted. ");
    static notthyroid = new interpPhrase("Last thyroid studies were normal. ")

    // b12 phrases
    static b12normal = new interpPhrase("B12 is normal. ")
    static b12low = new interpPhrase("B12 is low, which may cause this "+ EHRdata.MCV.isHigh ? "macrocytic" : "normocytic" + " anemia. Consider B12 replacement therapy. ")

    static folatenormal = new interpPhrase("Folate is normal. ")
    static folatelow = new interpPhrase("Folate is low, which may cause this "+ EHRdata.MCV.isHigh ? "macrocytic" : "normocytic" + " anemia. Consider folate replacement therapy. ")
    static recfolate = new interpPhrase("Recommend obtaining folate. ")

    // additional recommendations
    static recstem = new interpPhrase("Recommend obtaining ")
    static recipf = new interpPhrase("immature platelet fraction (IPF)")
    static recflow = new interpPhrase("flow cytometry")
    static recreticslist = new interpPhrase("reticulocytes")


}