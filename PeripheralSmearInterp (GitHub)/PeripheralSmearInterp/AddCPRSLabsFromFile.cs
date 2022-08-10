using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Globalization;
using SharedLibrary;

namespace PeripheralSmearInterp
{
    /// <summary>
    /// Do add an additional labs file, label it like this -> Labs_1234.txt
    /// Where '1234' is the last 4 of the social.
    /// </summary>
    internal class AddCPRSLabsFromFile
    {
        internal static DataTable MergeExtractionWithNewLabs(DataTable cdwDt, string pathOutputBS)
        {
            //Find patients you want to look for...
            var patientIds = cdwDt.AsEnumerable().Where(r => r[1].ToString() == "Demographics")
                .Select(r => new { 
                    NameLast4 = r[2].ToString()[0] + r[3].ToString(),
                    PatientSID = r[0].ToString()
                }).ToList(); //first letter last name, last 4.

            //Look for each patient...
            foreach (var patientId in patientIds) { 
                var path = pathOutputBS + "Labs_" + patientId.NameLast4 + ".txt";
                if (!File.Exists(path))
                    continue;

                var cprsLabDt = ParseLabs(path, patientId.PatientSID);
                cdwDt.Merge(cprsLabDt);
            }
            var outputDt = cdwDt.AsEnumerable().GroupBy(x => new { PatientSID = x[0], Domain = x[1], TestId = x[8] }).Select(y => y.OrderByDescending(z => z[7]).First()).CopyToDataTable();
            return outputDt;
        }

        private static DataTable ParseLabs(string pathForLab, string patientSID)
        {
            var pathOutput = @"\\R04.med.va.gov\V01\WHC\Users\VHACONHAUSER\Desktop\Labs_Output.txt";
            var lines = File.ReadAllLines(pathForLab);

            var startToSave = "      Test name";
            var stopSaving = new List<string>() { "===============", "Comment: " };
            var evalPhrase = "      Eval: ";
            var saveDate = "    Specimen Collection Date: ";
            var saveSpecimen = "  Specimen: ";

            var outputLines = new List<string>();
            ParseFile(lines, startToSave, stopSaving, evalPhrase, saveDate, saveSpecimen, outputLines);
            File.WriteAllLines(pathOutput, outputLines); //write the lines to file

            DataTable dt = CreateDataTableFromLines(saveDate, saveSpecimen, outputLines, patientSID);

            //FilterDataTableToTestsOfInterest
            var testOfInterestDict = LoadDictionary.Resource(Resource.Resource.TestNameSpecimenToTestId, false);
            var j = 1;
            for (int i = dt.Rows.Count - 1; i >= 0; i--)
            {
                var testNameSpecimen = dt.Rows[i][2].ToString() + "|" + dt.Rows[i][9].ToString();
                if (!testOfInterestDict.ContainsKey(testNameSpecimen))
                    dt.Rows[i].Delete();
                else
                    dt.Rows[i][8] = testOfInterestDict[testNameSpecimen];
            }

            //Select the most recent lab grouped by (name,specimen)
            var outputDt = dt.AsEnumerable().GroupBy(x => x[2].ToString() + "|" + x[9].ToString()).Select(y => y.OrderByDescending(z => z[7]).First()).CopyToDataTable();
            return outputDt;
        }

        private static DataTable CreateDataTableFromLines(string saveDate, string saveSpecimen, List<string> outputLines, string patientSID)
        {
            var dt = new DataTable();
            dt.Columns.Add("PatientSID", typeof(Int32));
            dt.Columns.Add("Domain", typeof(string));
            dt.Columns.Add("TestName", typeof(string));
            dt.Columns.Add("Result", typeof(string));
            dt.Columns.Add("RefLow", typeof(string));
            dt.Columns.Add("RefHigh", typeof(string));
            dt.Columns.Add("Unit", typeof(string));
            dt.Columns.Add("SpecimenDt", typeof(DateTime));
            dt.Columns.Add("TestId", typeof(string));
            dt.Columns.Add("Specimen", typeof(string));
            var specimenDtParsed = new DateTime();
            var specimen = "";
            foreach (var line in outputLines)
            {
                if (line.Contains("Test Not Performed"))
                    continue;
                if (line.StartsWith(saveSpecimen))
                {
                    specimen = line.Substring(line.IndexOf(':') + 1, line.IndexOf('.') - line.IndexOf(':') - 1);
                    continue;
                }
                if (line.StartsWith(saveDate))
                {
                    var specimenDt = line.Substring(saveDate.IndexOf(':') + 1).Trim();
                    if (DateTime.TryParseExact(specimenDt, "MMM dd, yyyy@HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out specimenDtParsed))
                    {
                        specimenDt = specimenDtParsed.ToString("yyyy-MM-dd HH:mm");
                    }
                    else if (DateTime.TryParseExact(specimenDt, "MMM dd, yyyy", CultureInfo.InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out specimenDtParsed))
                    {
                        specimenDt = specimenDtParsed.ToString("yyyy-MM-dd");
                    }
                    continue;
                }
                var row = dt.NewRow();
                row[0] = patientSID;
                row[1] = "Lab";
                row[2] = line.Substring(0, 28).Trim(); //test name
                row[3] = line.Substring(28, 7).Trim(); //result
                if (line.Substring(51, 14).Trim() != String.Empty)
                {
                    var refLowHigh = ParseRefLowHigh(line.Substring(51, 14).Trim());
                    row[4] = refLowHigh.Item1;
                    row[5] = refLowHigh.Item2;
                }
                row[6] = line.Substring(38, 12).Trim(); ; //unit
                row[7] = specimenDtParsed;
                row[8] = "";
                row[9] = specimen.Trim();
                dt.Rows.Add(row);
            }

            return dt;
        }

        private static void ParseFile(string[] lines, string startToSave, List<string> stopSaving, string evalPhrase, string saveDate, string saveSpecimen, List<string> outputLines)
        {
            var lineWasTestName = false;
            foreach (var line in lines)
            {
                if (line.StartsWith(saveDate) || line.StartsWith(saveSpecimen))
                    outputLines.Add(line);

                if (line.StartsWith(startToSave))
                {
                    lineWasTestName = true;
                    continue;
                }
                if (line.StartsWith(stopSaving[0]) || line.StartsWith(stopSaving[1]))
                {
                    lineWasTestName = false;
                    continue;
                }

                if (lineWasTestName)
                {
                    if (line.StartsWith(evalPhrase))
                        continue;
                    outputLines.Add(line);
                }
            }
        }

        internal static Tuple<string, string> ParseRefLowHigh(string refLowHigh)
        {
            var refLow = "";
            var refHigh = "";
            if (refLowHigh.Contains("Ref:"))
            {
                if (refLowHigh.Contains("="))
                {
                    var indexOf = refLowHigh.IndexOf('=');
                    refLow = refLowHigh.Substring(indexOf + 1, refLowHigh.Length - indexOf - 1);
                }
            }
            else
            {
                var refParts = refLowHigh.Split(new string[] { " - " }, StringSplitOptions.None);
                refLow = refParts[0];
                refHigh = refParts[1];
            }
            return Tuple.Create(refLow, refHigh);
        }
    }
}
