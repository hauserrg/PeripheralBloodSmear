using SharedLibrary;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PeripheralSmearInterp
{
    class WritePeripheralSmear
    {
        internal static void WriteEHRDataFile(DataTable dt, string sourceDirectory, string pathOutputBS)
        {
            //Per patient
            var currentPatientSID = dt.Rows[0][0].ToString();
            //->demographics
            var patientName = "";
            var last4 = "";
            var age = "";
            var sex = "";
            var reasonForConsult = "";
            //->labs
            var labIdMap = LoadDictionary.Resource(Resource.Resource.TestIdToWebIdDictionary, false);
            var labTemplate = @"static {0} = new Lab(""{0}"", {1}, ""{2}"", ""{3}"", ""{4}"", ""{5}"");";
            var labOutput = new StringBuilder();
            //->medications
            var medTemplate = @"static {0} = new Med(""{0}"", ""{1}"", ""{2}"", ""{3}"");";
            var medOutput = new StringBuilder();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                var row = dt.Rows[i];
                var domain = row[1].ToString();
                if (domain == "Demographics")
                {
                    patientName = row[2].ToString();
                    last4 = row[3].ToString();
                    age = row[4].ToString();
                    sex = row[5].ToString();
                    reasonForConsult = row[6].ToString().Trim();
                }
                else if (domain == "Lab")
                {
                    var labName = labIdMap[row[8].ToString()];
                    labIdMap[row[8].ToString()] = "";
                    var result = FormatResult(row[3].ToString());
                    var line = "  " + String.Format(labTemplate, labName, result, row[6].ToString(), row[7].ToString()
                        , row[4].ToString().Replace("\"", "").Replace(">", "").Replace("=", "")
                        , row[5].ToString().Replace("\"", "").Replace(">", "").Replace("=", "")
                        ) + "\r\n";
                    line = line.Replace("\"\"", "null"); //null database values are empty strings.
                    labOutput.Append(line);
                }
                else if (domain == "Med")
                {
                    var line = "  " + String.Format(medTemplate, row[2].ToString(), row[3].ToString(), row[4].ToString(), row[5].ToString()) + "\r\n";
                    labOutput.Append(line);
                }

                //peek ahead to see if patient changed
                if (i + 1 == dt.Rows.Count || dt.Rows[i + 1][0].ToString() != currentPatientSID)
                {
                    //fill in missing labs as null
                    foreach (var key in labIdMap.Keys)
                    {
                        if (labIdMap[key] != "")
                        {
                            //Empty string for missing labs because null causes errors.
                            var missingLab = "  " + String.Format(labTemplate, labIdMap[key], "null", "null", "null", "null", "null") + "\r\n";
                            missingLab = missingLab.Replace("\"null\"", "null");
                            labOutput.Append(missingLab);
                        }
                    }
                    labIdMap = LoadDictionary.Resource(Resource.Resource.TestIdToWebIdDictionary, false);

                    //save patient; write file
                    var targetDirectory = pathOutputBS + last4;
                    ManipulateDir.Copy(sourceDirectory, targetDirectory);
                    var output = String.Format(Resource.Resource.EHRDataJs, patientName, last4, age, sex, reasonForConsult, labOutput.ToString());
                    File.WriteAllText(targetDirectory + "\\js\\EHRdata.js", output);

                    //reset variables
                    if (i + 1 < dt.Rows.Count)
                        currentPatientSID = dt.Rows[i + 1][0].ToString();
                    patientName = "";
                    last4 = "";
                    age = "";
                    sex = "";
                    reasonForConsult = "";
                    labOutput.Clear();
                }
            }
        }

        internal static string FormatResult(string result)
        {
            result = result.Replace("\"", ""); //Removing " because causing JS errors.
            var resultTemp = 1f;
            if (float.TryParse(result, out resultTemp))
            {
                return result;
            }
            return String.Concat("\"", result, "\"");
        }
    }
}
