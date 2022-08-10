using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Attachmate.Reflection.Framework;
using Attachmate.Reflection.UserInterface;
using Attachmate.Reflection.Emulation.OpenSystems;
using System.IO;
using SharedLibrary;
using System.Globalization;

namespace PeripheralSmearInterp
{
    internal class UpdateCDWFromVista
    {
        internal static void UpdateConsultListInCDWFromVista()
        {
            //Get text from VISTA
            var consultsToParse = GetConsultList();
                //var consultsToParse = File.ReadAllLines(@"\\R04.med.va.gov\V01\WHC\Users\VHACONHAUSER\Desktop\dataOS.csv");//GetConsultList();
            
            //Parse text
            var dt = DataTableUtil.InitWithString(5); //Last name, first initial, last 4, consult date, PENDING
            foreach (var line in consultsToParse)
            {
                if (line.StartsWith("Pending"))
                {
                    var info = line.Substring(31, 33);
                    var parts = info.Split(new char[] { ' ', ',', '.', '(', ')'}, StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length != 4) continue;
                    var row = dt.NewRow();
                    row[0] = parts[1]; //Last name
                    row[1] = parts[2]; //first initial
                    row[2] = parts[3]; //last 4
                    row[3] = DateTime.Parse(parts[0]); //consult date
                    row[4] = "PENDING"; //PENDING
                    dt.Rows.Add(row);
                }
            }

            //Load text
            var cs = ConMgr.Get(Db.VaNationalMyDb);
            var dbTableName = "Bashar.Consult_List_FromVista";
            SqlTable.TruncateTable(dbTableName, cs);
            SqlTable.BulkInsertDataTable(cs, dbTableName, dt);

            //Add to consult list
            SqlTable.ExecuteNonQuery(cs, Resource.Resource.UpdateCDWFromVista);
        }

        private static List<string> GetConsultList()
        {
            //Start a second visible instance of a workspace and get a handle to the instance running at the given channel name ("Workspace2")  
            //MyReflection.Start("Workspace2");
            Application app = MyReflection.CreateApplication("WorkSpace", false); //false for invisible

            string sessionPath = @"C:\ProgramData\Micro Focus\Reflection\VistA-INI.rdox";
            ITerminal terminal = (ITerminal)app.CreateControl(sessionPath);

            //Create a View to make the session visible
            IFrame frame2 = (IFrame)app.GetObject("Frame");
            frame2.CreateView(terminal);

            //Get a handle to the screen and wait until it is ready
            IScreen screen = (IScreen)terminal.Screen;
            //var text = screen.GetText(1, 1, 50); //to be with an understanding and acceptance that th
            screen.WaitForHostSettle(3000, 6000);
            screen.SendControlKey(Attachmate.Reflection.Emulation.OpenSystems.ControlKeyCode.Return);

            var waitTime1 = 500;
            var waitTime2 = 750;
            screen.SendKeys(Resource.Resource.access);
            screen.SendControlKey(Attachmate.Reflection.Emulation.OpenSystems.ControlKeyCode.Return);
            screen.WaitForHostSettle(waitTime1, waitTime2);
            screen.SendKeys(Resource.Resource.verify);
            screen.SendControlKey(Attachmate.Reflection.Emulation.OpenSystems.ControlKeyCode.Return);
            screen.WaitForHostSettle(waitTime1, waitTime2);
            screen.SendKeys("^service");
            screen.SendControlKey(Attachmate.Reflection.Emulation.OpenSystems.ControlKeyCode.Return);
            screen.WaitForHostSettle(waitTime1, waitTime2);
            screen.SendKeys("4");
            screen.SendControlKey(Attachmate.Reflection.Emulation.OpenSystems.ControlKeyCode.Return);
            screen.WaitForHostSettle(waitTime1, waitTime2);
            screen.SendKeys("clinical pathology");
            screen.SendControlKey(Attachmate.Reflection.Emulation.OpenSystems.ControlKeyCode.Return);
            screen.WaitForHostSettle(waitTime1, waitTime2);
            screen.SendControlKey(Attachmate.Reflection.Emulation.OpenSystems.ControlKeyCode.Return);
            screen.WaitForHostSettle(waitTime1, waitTime2);
            var text = GetTheData(screen);

            //Close windows security - windows certificate/pin
            MSWindowFcns.CloseWindow("Windows Security");

            //Close the workspaces
            app.Close(ApplicationCloseOption.CloseNoSave);            //Start a second visible instance of a workspace and get a handle to the instance running at the given channel name ("Workspace2")  
            return text.Split(new string[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries).ToList();
        }

        private static string GetTheData(IScreen screen)
        {
            string dataLine = "";
            //string path = @"\\R04.med.va.gov\V01\WHC\Users\VHACONHAUSER\Desktop\dataOS.csv";//File to write data to

            //Get the screen coordinates of the first row of data
            Attachmate.Reflection.Emulation.OpenSystems.ScreenPoint startingRow = screen.SearchText("Service Consults by Status", 1, 1, FindOptions.Forward);
            Attachmate.Reflection.Emulation.OpenSystems.ScreenPoint endingRow = screen.SearchText("Select Item(s)", 1, 1, FindOptions.Forward);
            int dataRow = startingRow.Row;
            int dataCol = startingRow.Column;

            //Get the data line by line and format it as a comma separated list
            var sb = new StringBuilder();
            for (int i = 0; i < endingRow.Row - startingRow.Row; i++)
            {
                //Get a line of data
                dataLine = screen.GetText(dataRow, dataCol, 80).Trim();

                //Add the line to the data string
                sb.Append(dataLine + Environment.NewLine);
                dataRow++;
            }

            //Display the data on the console
            var text = sb.ToString();
            Console.WriteLine(text);

            return text;
        }
    }
}
