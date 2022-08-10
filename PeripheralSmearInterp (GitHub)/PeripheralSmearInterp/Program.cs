using SharedLibrary;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PeripheralSmearInterp
{
    class Program
    {
        static void Main(string[] args)
        {
            //Parameters
            var sourceDirectory = @"" //Folder with website -> See "website" folder in this solution.
            var pathOutputBS = @""; //Folder where website is written

            //Update consult list from Vista
            UpdateCDWFromVista.UpdateConsultListInCDWFromVista();

            //Extraction
            var cdwDt = SqlTable.GetTable(Resource.Resource.Extraction_all, ""); //Connection string required

            //File IO
            ManipulateDir.EmptyFolder(pathOutputBS.RemoveFromEnd("\\"));
            WritePeripheralSmear.WriteEHRDataFile(cdwDt, sourceDirectory, pathOutputBS);
        }
    }
}
