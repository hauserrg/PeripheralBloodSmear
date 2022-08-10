//Notes:

// changes:
// - platelets logic: no longer relies on ipf checkbox to work
// - checkbox format
// - checkbox availability guided by data

dev_enable = false;

class Interpretation{


  constructor(){}
  

  // main attribute, when queried will return the entire interpretation phrase list
  get phraseList(){
    var phrase_list = [];
    phrase_list = phrase_list.concat(this.header);
    phrase_list = phrase_list.concat(this.morphology);
    phrase_list = phrase_list.concat(proserDict.blankline.text);
    phrase_list = phrase_list.concat(this.impression);
    phrase_list = phrase_list.concat(this.recommendations);
    phrase_list = phrase_list.concat(this.footer);
    return phrase_list;
  }

  // phrase list component functions. all return a list even if single phrase for uniformity

  // basic header components
  get header() {
    return([
      proserDict.title.text,
      proserDict.hxstem.text,
    ]);
  }

  // morphology phrase collector - each line has own morphology phrase generator
  get morphology() {
    var phrase_list = [proserDict.morphstem.text];
    phrase_list = phrase_list.concat(this.cellLineMorphology);
    phrase_list = phrase_list.concat(this.rbcMorphology);
    phrase_list = phrase_list.concat(this.wbcMorphology);
    phrase_list = phrase_list.concat(this.plateletMorphology);
    return phrase_list;
  }

  get impression() {
    var phrase_list = [proserDict.impressionstem.text];
    phrase_list = phrase_list.concat(this.rbcImpression);
    phrase_list = phrase_list.concat(this.wbcImpression);
    phrase_list = phrase_list.concat(this.plateletImpression);
    return phrase_list;
  }

  get recommendations() {
    var phrase_list = [];

    if ($('#ipf').is(":checked")) {
      phrase_list = phrase_list.concat([proserDict.recipf.text]);
    }
    if ($('#requestRetics').is(":checked")) {
      phrase_list = phrase_list.concat([proserDict.recreticslist.text]);
    }
    if ($("#flowCytometry").is(":checked")){
      phrase_list = phrase_list.concat([proserDict.recflow.text]);
    }

    if (phrase_list.length>0) {
      var phrase_string = listToCommaString(phrase_list);
      phrase_list = [proserDict.recstem.text].concat([phrase_string]);
    }

    return phrase_list;
  }

  get footer()  {
    return([
      proserDict.footer.text
    ])
  }
  
  ////////////////////////////////MORPHOLOGY///////////////////////////////////

  // overall cell line mophology statements
  get cellLineMorphology(){
    if( EHRdata.hemoglobin.isLow && EHRdata.WBCs.isLow && EHRdata.Platelets.isLow){
      return proserDict.pancytopenia.text;
    } else if( EHRdata.hemoglobin.isLow && EHRdata.WBCs.isLow ){
      return proserDict.bicytopeniaRW.text;
    } else if( EHRdata.hemoglobin.isLow && EHRdata.Platelets.isLow ){
      return proserDict.bicytopeniaRP.text;
    } else if( EHRdata.WBCs.isLow && EHRdata.Platelets.isLow ){
      return proserDict.bicytopeniaWP.text;
    } else if(EHRdata.WBCs.isNormal){
      return proserDict.null.text;
    }
  }

  // line specific phrases
  get rbcMorphology () {

    var rbc_phrases = [];

    // general rbc size, chromaticity
    var mcv = EHRdata.MCV.isLow ? proserDict.microcytic : (EHRdata.MCV.isHigh ? proserDict.macrocytic : proserDict.normocytic);
    var mchc = EHRdata.MCHC.isLow ? proserDict.hypochromic : (EHRdata.MCHC.isHigh ? proserDict.hyperchromic : proserDict.normochromic);
    var hgblevel = EHRdata.hemoglobin.isLow ? proserDict.anemia : proserDict.normalhgb;
    rbc_phrases = rbc_phrases.concat([mcv.text, mchc.text,hgblevel.text]);

    // anisocytosis is obtainable from cbc

    if (EHRdata.RDW.isHigh) {
      rbc_phrases = rbc_phrases.concat([proserDict.highrdw.text]);
    }



    var rbc_dropdown_phrase = this.rbcDropdownPhrase;

    rbc_phrases = rbc_phrases.concat(rbc_dropdown_phrase);

    return rbc_phrases;
  }


  get rbcDropdownPhrase() {
    // process rbc dropdown input
    var rbc_dd_phrase = [];

    var rbc_dd_list = $('#rbcFindings').val();

    if (rbc_dd_list.includes("noschistocytes")) {
      rbc_dd_phrase = rbc_dd_phrase.concat([proserDict.noschistocytes.text]);
      const index = rbc_dd_list.indexOf("noschistocytes");
      rbc_dd_list.splice(index,1);
    } 

    if (rbc_dd_list.length > 0){
      rbc_dd_phrase = rbc_dd_phrase.concat(["There are "]);  
      rbc_dd_list = rbc_dd_list.map((x) => proserDict[x].text);
      var rbc_dd_string = listToCommaString(rbc_dd_list,false);
      rbc_dd_phrase = rbc_dd_phrase.concat([rbc_dd_string,proserDict.rbcmorphtypesend.text]);
    }

    return rbc_dd_phrase;
  }

  
  
  get wbcMorphology() {
    
    var wbc_phrase = [];
    
    // general wbc count abnormalities
    var abnormalFlag = false;
    if (EHRdata.WBCs.isNormal) {
      wbc_phrase = wbc_phrase.concat(proserDict.wbcnormal.text);
    } else if (EHRdata.WBCs.isHigh) {
      wbc_phrase = wbc_phrase.concat(proserDict.wbchigh.text);
      abnormalFlag = true;
    } else {
      wbc_phrase = wbc_phrase.concat(proserDict.wbclow.text);
      abnormalFlag = true;
    }
    
    // wbc line abnormalities
    var wbc_line_phrase = [];
    
    if(EHRdata.Neutrophils.isHigh) {
      wbc_line_phrase = wbc_line_phrase.concat(proserDict.neuthigh.text);
    } else if (EHRdata.Neutrophils.isLow) {
      wbc_line_phrase = wbc_line_phrase.concat(proserDict.neutlow.text);
    }
    if(EHRdata.Lymphocytes.isHigh) {
      wbc_line_phrase = wbc_line_phrase.concat(proserDict.lymphhigh.text);
    } else if (EHRdata.Lymphocytes.isLow) {
      wbc_line_phrase = wbc_line_phrase.concat(proserDict.lymphlow.text);
    }
    if(EHRdata.Monocytes.isHigh) {
      wbc_line_phrase = wbc_line_phrase.concat(proserDict.monohigh.text);
    } else if (EHRdata.Monocytes.isLow) {
      wbc_line_phrase = wbc_line_phrase.concat(proserDict.monolow.text);
    }
    if(EHRdata.Eosinophils.isHigh) {
      wbc_line_phrase = wbc_line_phrase.concat(proserDict.eohigh.text);
    } else if (EHRdata.Eosinophils.isLow) {
      wbc_line_phrase = wbc_line_phrase.concat(proserDict.eolow.text);
    }
    if(EHRdata.Basophils.isHigh) {
      wbc_line_phrase = wbc_line_phrase.concat(proserDict.basohigh.text);
    } else if (EHRdata.Basophils.isLow) {
      wbc_line_phrase = wbc_line_phrase.concat(proserDict.basolow.text);
    }
    
    // compose general and line abnormalities
    if (wbc_line_phrase.length > 0) {
      if (abnormalFlag) {
        wbc_line_phrase = ["with "].concat([listToCommaString(wbc_line_phrase)]);
      } else {
        wbc_phrase = ["There is "];
        wbc_line_phrase = [listToCommaString(wbc_line_phrase)];
      }
      
    } else {
      wbc_line_phrase = [proserDict.nowbclineabnl.text]
    }

    wbc_phrase = wbc_phrase.concat(wbc_line_phrase);


	
	var wbc_dropdown_phrase = this.wbcDropdownPhrase;
	
    wbc_phrase = wbc_phrase.concat(wbc_dropdown_phrase);

    return wbc_phrase
  }
  
  get wbcDropdownPhrase() {
	
	var wbc_app_phrase = [];
    var wbc_app_list = $('#wbcFindings').val();

    if (wbc_app_list.length > 0){
      wbc_app_phrase = wbc_app_phrase.concat(["There are "]);
      wbc_app_list = wbc_app_list.map((x) => proserDict[x].text);
      var wbc_app_string = listToCommaString(wbc_app_list,false);
      wbc_app_phrase = wbc_app_phrase.concat([wbc_app_string,proserDict.wbcmorphtypesend.text]);
    }
	
	return wbc_app_phrase;
  }

  get plateletMorphology(){

    // general platelet count abnormalities
    var plt_phrase = [];
    if (EHRdata.Platelets.isNormal) {
      plt_phrase = plt_phrase.concat(proserDict.pltnormal.text);
    } else if (EHRdata.Platelets.isHigh) {
      plt_phrase = plt_phrase.concat(proserDict.plthigh.text);
    } else {
      plt_phrase = plt_phrase.concat(proserDict.pltlow.text);
    }

    // appearance abnormalities
	plt_phrase = plt_phrase.concat(this.plateletDropdownPhrase);
	
    return plt_phrase;
  }
  
  get plateletDropdownPhrase(){
	var plt_phrase = [];
	var plt_app_list = $('#pltFindings').val();
    if (plt_app_list.length == 1 & plt_app_list[0]=="normal") {
      plt_phrase = plt_phrase.concat([proserDict.pltsizenormalstart.text,proserDict.pltsizenormal.text,proserDict.pltsizenormalend.text]);
    } else {
      const plt_app_dict = {
        "normal": proserDict.pltsizenormal.text,
        "large": proserDict.pltsizelarge.text,
        "giant": proserDict.pltsizegiant.text,
      }
  
      plt_app_list = plt_app_list.map((x) => plt_app_dict[x]);
      var plt_app_string = listToCommaString(plt_app_list,false);
      plt_phrase = plt_phrase.concat(["There are ",plt_app_string,proserDict.pltsizeabnormalend.text]);
    }
	
	return plt_phrase;
  }
  

  /////////////////////////////// Impression ///////////////////////////////////

  get rbcImpression(){

    var rbc_phrases = [];
        
    // only comment on these if anemia is present
    // if fe deficiency status is not clear or not tested for, provide menzner
    if (EHRdata.hemoglobin.isLow) {
      
      //microcytic
      if (EHRdata.MCV.isLow){
        rbc_phrases = rbc_phrases.concat([proserDict.microcyticheader.text]);

        // TODO: find formatting of hemoglobin electrophoresis
        if (!(EHRdata.hemoglobinElectrophoresis.result === null)) {
          rbc_phrases = rbc_phrases.concat([proserDict.hgbep.text])
        }

        if (!(EHRdata.Ferritin.result === null)) {
          rbc_phrases = rbc_phrases.concat(this.ironPhrase);
          if ((rbc_phrases[-1]==proserDict.inconclusiveiron.text)) {
            rbc_phrases = rbc_phrases.concat(this.mentzerPhrase);
          }
        } else {
          rbc_phrases = rbc_phrases.concat(this.mentzerPhrase);
          rbc_phrases = rbc_phrases.concat([proserDict.reciron.text]);
        }
      
      // normocytic
      } else if (EHRdata.MCV.isNormal) {

        rbc_phrases = rbc_phrases.concat([proserDict.normocyticheader.text]);
        rbc_phrases = rbc_phrases.concat([this.tshPhrase]);
        rbc_phrases = rbc_phrases.concat([this.b12folatePhrase]);

      } else if (EHRdata.MCV.isHigh){
        rbc_phrases = rbc_phrases.concat([proserDict.macrocyticheader.text]);
        rbc_phrases = rbc_phrases.concat([this.tshPhrase]);
        rbc_phrases = rbc_phrases.concat([this.b12folatePhrase]);
      }

	  //Only run RPI if reticulocyte and hematocrit are present.
	  if(!(EHRdata.ReticulocytesPct.result === null || EHRdata.hematocrit.result === null)){
		rbc_phrases = rbc_phrases.concat(this.rpiPhrase);
	  }

    } else if (EHRdata.hemoglobin.isHigh) {
      rbc_phrases = rbc_phrases.concat([proserDict.erythrocytosis.text]);
    }

    // comment on hemolysis
    var rbc_app_list = $('#rbcFindings').val();
    var hemolysis_list = rbc_app_list.filter(value => ["schistocytes","microspherocytes"].includes(value));
    if (!(rbc_app_list.includes('schistocytes') || rbc_app_list.includes('microspherocytes'))) {
      if (EHRdata.hemoglobin.isLow) {
        rbc_phrases = rbc_phrases.concat([proserDict.nosmearivhemolysis.text]);
      }
    } else {
      rbc_phrases = rbc_phrases.concat([proserDict.hemolysiswrapper1.text,listToCommaString(hemolysis_list,false),proserDict.hemolysiswrapper2.text])
    }

    return rbc_phrases;
  }

  // TODO add WBC impression
  get plateletImpression(){
    var plt_phrase = [];
    if(EHRdata.Platelets.isLow){
      if(!(EHRdata.immaturePlateletFraction.result === null)){
        if(EHRdata.immaturePlateletFraction.isHigh){
          plt_phrase = plt_phrase.concat([proserDict.ipfhigh.text]);
        } else {
          plt_phrase = plt_phrase.concat([proserDict.ipfnl.text]);
        }
      } else if(EHRdata.Platelets.isLow && EHRdata.Platelets.result > 100){ //not ipf, ration
        plt_phrase = plt_phrase.concat([proserDict.ipfration.text]);
      } else { //no ipf, irrational
        plt_phrase = plt_phrase.concat([proserDict.ipfwrong.text]);
      }
    } else if(EHRdata.Platelets.isHigh){
      plt_phrase = plt_phrase.concat([proserDict.thrombocytosis.text]);
    }
    return plt_phrase;
  }

  get tshPhrase(){
    var tsh_phrase = [];
    if(EHRdata.tsh.isHigh){
      //no FT4
      if(EHRdata.ft4.result === null){
        tsh_phrase = tsh_phrase.concat([proserDict.rect4.text]);
      } else if(EHRdata.ft4.isLow){
        //low FT4
        tsh_phrase = tsh_phrase.concat([proserDict.t4low.text]);
      } else if(EHRdata.ft4.isNormal){
        //I think - https://pubmed.ncbi.nlm.nih.gov/22200582/
        tsh_phrase = tsh_phrase.concat([proserDict.subclinicalhypothyroid.text]);
      }
    }

    if(EHRdata.tsh.isNormal){
      tsh_phrase = tsh_phrase.concat([proserDict.notthyroid.text]);
    }
    return tsh_phrase;
  }

  get b12folatePhrase() {
    var phrase_list = [];
    //B12
    if(EHRdata.B12.result === null){      
    } else if(EHRdata.B12.isLow){
      phrase_list = phrase_list.concat([proserDict.b12low.text]);
    } else if(EHRdata.B12.isNormal){
      phrase_list = phrase_list.concat([proserDict.b12normal.text]);
    }
    //folate
    if(EHRdata.folate.result === null && EHRdata.B12.result !== null){	  
      phrase_list = phrase_list.concat([proserDict.recfolate.text]);
    } else if(EHRdata.folate.isLow){
    } else if(EHRdata.folate.isNormal){
      phrase_list = phrase_list.concat([proserDict.folatenormal.text]);
    }
    return phrase_list;
  }

  get rpiPhrase(){
    if(EHRdata.rpi() < 2){
      return [proserDict.lowrpi.text];  
    } else if(EHRdata.rpi() >= 2){
      return [proserDict.highrpi.text];
    } else {
      // if ($('#requestRetics').val()) {
      //   return [proserDict.recretics.text];
      // }
    }

  }

  get mentzerPhrase() {
    if(EHRdata.MCV.result === null || EHRdata.RBCs.result === null){
      return [];
    }
    var index = EHRdata.MCV.result / EHRdata.RBCs.result;
    if(index > 13){
      return [proserDict.highmentzer.text];  
    } else if(index < 13){
      return [proserDict.lowmentzer.text];  
    }
  }

  get ironPhrase(){
    if(EHRdata.Ferritin.isLow && EHRdata.Transferrin.isHigh){
      return [proserDict.irondefanemia.text];
    } else if(EHRdata.Ferritin.isHigh && EHRdata.Transferrin.isLow){
      return [proserDict.acd_ai.text];
    } else if(EHRdata.Ferritin.isNormal && EHRdata.Transferrin.isNormal && EHRdata.Iron.isNormal && EHRdata.TIBC.isNormal && EHRdata.TransferrinSaturation.isNormal){
      return [proserDict.normaliron.text];
    }
    //One is in the right direction, but the other is inconclusive. 	
    else {
      return [proserDict.inconclusiveiron.text];
    }
  }
}

interp = new Interpretation();
// document.getElementById('interp').value = interp.phraseList.join('');





///////////////////////////// Standalone functions ///////////////////////////
function LabFormatResult(result, refLow, refHigh, id){
  if( result === null){
    return;
  }
  if(id == "urineBlood"){
    if(result != "NEG" && result != "NEGATIVE"){  //Note: If you use your lab mapping this will come across as a standardized "Neg" result
      $('#' + id + " .unit").html( $('#' + id + " .unit").html() + " \u2191");
      $('#' + id).addClass('table-danger');
    }
    return;
  }
  if(refLow !== null){	  
    if( result < refLow ){
      $('#' + id + " .unit").html( $('#' + id + " .unit").html() + " \u2193")
      $('#' + id).addClass('table-danger');
    }
  }
  if(refHigh !== null){
    if( result > refHigh ){
      $('#' + id + " .unit").html( $('#' + id + " .unit").html() + " \u2191")
      $('#' + id).addClass('table-danger');
    }	  
  }
}

function listToCommaString(stringList,endingPeriod=true) {
  
  if (stringList.length > 1) {
    stringList[stringList.length-1] = "and " + stringList[stringList.length-1];
  }
  var stringOut = "";
  if (stringList.length==2){
    stringOut = stringList.join(' ');
  } else {
    stringOut = stringList.join(', ');
  }


  if (endingPeriod) {
    stringOut = stringOut+". ";
  }

  return stringOut;
}

function resetFieldAccess(){
  if (EHRdata.Platelets.isNormal) {
    $('#ipf').prop('disabled', true)
  } else {
    $('#ipf').prop('disabled', false)
  }
  
  if (EHRdata.hemoglobin.isNormal) {
    $('#requestRetics').prop('disabled', true)
    $('#rpi').prop('disabled', true)
  } else {
    $('#requestRetics').prop('disabled', false)
    $('#rpi').prop('disabled', false)
  }
  
  if (EHRdata.ReticulocytesPct.result === null) {
    $('#rpi').prop('disabled', true)
  } else {
    $('#rpi').prop('disabled', false)
  }
}




////////////////////////// JQuery Code //////////////////////
$(document).ready(function(){

  if (!dev_enable){
    $("#labtable td").attr("contentEditable","false");
    $("#cbctable td").attr("contentEditable","false");
    $("#reInitialize").remove();
  }

  //load
  //span text 
  $('#patientName').text(EHRdata.patientName);
  $('#last4').text(EHRdata.last4);
  //form input
  $('#age').val(EHRdata.age);
  $('#reasonForConsult').val(EHRdata.reasonForConsult);
  //form radio button
  if(EHRdata.gender = "male"){
    $("#sexMale").prop("checked", true);
  } else {
    $("#sexFemale").prop("checked", true);
  }  
  

  $('#rbcFindings').multiselect(
    {
      nonSelectedText: 'RBC Findings',
      enableFiltering: true,
      onChange: function(event){
        var rbc_dd_list = $('#rbcFindings').val();
        if (rbc_dd_list.includes("schistocytes")&&rbc_dd_list.includes("noschistocytes")) {
          $('#rbcFindings').multiselect('deselect','schistocytes');
          alert('Both Schistocytes and No Schistocytes selected. Defaulted to No Schistocytes.');
        } 
        console.log('rbc changed')
      }
    }
  );
  $('#wbcFindings').multiselect(
    {
      nonSelectedText: 'WBC Findings'
    }
  );
  $('#pltFindings').multiselect(
    {
      nonSelectedText: 'Platelet Findings',
    }
  );

  $('#copy-rbc').on('click',function(){
    var rbc_text = interp.rbcDropdownPhrase;
    navigator.clipboard.writeText(rbc_text.join(""));
  });
  
  $('#copy-wbc').on('click',function(){
    var wbc_text = interp.wbcDropdownPhrase;
    navigator.clipboard.writeText(wbc_text.join(""));
  });
  
  $('#copy-plts').on('click',function(){
    var plt_text = interp.plateletDropdownPhrase;
    navigator.clipboard.writeText(plt_text.join(""));
  });

  
  //set input with result
  for (const property in EHRdata) {
    if(typeof EHRdata[property] == "object" && EHRdata[property].constructor.name == "Lab"){
      $('#' + EHRdata[property].name + ' .result').html(EHRdata[property].resultNoUnit);
      $('#' + EHRdata[property].name + ' .unit').html(EHRdata[property].resultUnit);
      $('#' + EHRdata[property].name + ' .ref').html(EHRdata[property].refRange);
      $('#' + EHRdata[property].name + ' .specDate').html(EHRdata[property].complete);
      LabFormatResult(EHRdata[property].result, EHRdata[property].refLow, EHRdata[property].refHigh, EHRdata[property].name);
    }
	if(typeof EHRdata[property] == "object" && EHRdata[property].constructor.name == "Med"){
      $('#' + EHRdata[property].name + ' .drugName').html(EHRdata[property].drugName);
	  $('#' + EHRdata[property].name + ' .issueDate').html(EHRdata[property].issueDate);
	  $('#' + EHRdata[property].name + ' .status').html(EHRdata[property].status);
	}
  }  
  
  //age validation
  if( $('#age').val() == '' )
  $('#age').css("background-color", "pink");
  $('#age').on('input', function() {
    if( Math.floor(this.value) == this.value && $.isNumeric(this.value) ){
      $(this).css("background-color", "white");
      EHRdata.age = this.value;
    } else {
      $(this).css("background-color", "pink");
    }
  });
  
  //sex validation
  if( $('input[name=sexRadio]:checked', '#sex').val() == undefined ){
    $('#sex').css("background-color", "pink");
  }
  $('input[type=radio][name=sexRadio]').change(function() {
    $('#sex').css("background-color", "white");
    
    $('input[name=sexRadio]:checked', '#sex').each(function() {
      EHRdata.sex = this.nextElementSibling.textContent.toLowerCase();
    });
  });
  
  //reason for consult
  if( $('#reasonForConsult').val() == '' )
  $('#reasonForConsult').css("background-color", "pink");
  $('#reasonForConsult').on('input', function() {
    if( this.value != "" ){
      $(this).css("background-color", "white");
      EHRdata.reasonForConsult = this.value;
    } else {
      $(this).css("background-color", "pink");
    }
  });
  
  // Set limits on clinical phrases based on applicability
  resetFieldAccess()
  

  
  //keyboards
  $("#interp").keydown(function(event) {
    if(event.which == 113) {
        var cur_text = $("#interp").val();
        var start = cur_text.search(/\*\*\*/);
        if (start>0) {
          const textarea_el = document.getElementById('interp');
          textarea_el.setSelectionRange(start, start + 3);
        }
        return false;
    }
  });

  //check boxes
  // if(EHRdata.Platelets.isLow){
  //   $('#ipf').click();
  // }
  
  //refresh interpretation  
  $('#refreshInterpModal').click(function(){
    $('#interp').val(interp.phraseList.join(""));
    $('#refreshModal').modal('hide')
  });

  $('#copyAnyway').click(function(){
    console.log("Copy Anyway");
    var cur_text = $("#interp").val();
    navigator.clipboard.writeText(cur_text);
  });
  
  $('#copyInterp').click(function(){
    console.log("Copy Interp");
    var cur_text = $("#interp").val();
    var start = cur_text.search(/\*\*\*/);
    console.log(start)
    if (start>0) {
      $('#copyModal').modal('show')
    } else {
      navigator.clipboard.writeText(cur_text);
    }
  });

  // reinitialize from current edited table data - DEV only
  $('#reInitialize').click(function(){
    //console.log('made it')
    // transfer the current table data to EHRdata and reformat
    for (const property in EHRdata) {
      if(typeof EHRdata[property] == "object" && EHRdata[property].constructor.name == "Lab"){
        val_name = EHRdata[property].name
        new_val = $('#' + EHRdata[property].name + ' .result').html();
        if(val_name!="urineBlood"){
          new_val = Number(new_val)
        }
        val_type = typeof(new_val);
        //console.log({val_name,new_val,val_type});
        EHRdata[property].result = new_val
        
        $('#' + EHRdata[property].name + ' .unit').html(EHRdata[property].resultUnit);
        
        $('#' + EHRdata[property].name).removeClass('table-danger')
        LabFormatResult(EHRdata[property].result, EHRdata[property].refLow, EHRdata[property].refHigh, EHRdata[property].name);
      }
    }
    resetFieldAccess()
    $('#interp').val(interp.phraseList.join(""));
  })
  
  // after setting up, initialze the interpretation
  $('#refreshInterpModal').click();
});



