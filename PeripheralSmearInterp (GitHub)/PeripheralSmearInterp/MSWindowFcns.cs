using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace PeripheralSmearInterp
{
    internal class MSWindowFcns
    {
        [DllImport("user32.dll", SetLastError = true)]
        static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

        /// <summary>
        /// Find window by Caption only. Note you must pass IntPtr.Zero as the first parameter.
        /// </summary>
        [DllImport("user32.dll", EntryPoint = "FindWindow", SetLastError = true)]
        static extern IntPtr FindWindowByCaption(IntPtr ZeroOnly, string lpWindowName);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        static extern IntPtr SendMessage(IntPtr hWnd, UInt32 Msg, IntPtr wParam, IntPtr lParam);

        const UInt32 WM_CLOSE = 0x0010;

        internal static void CloseWindow(string windowName)
        {
            //Close windows security - windows certificate/pin
            System.Threading.Thread.Sleep(1000);
            IntPtr windowPtr = FindWindowByCaption(IntPtr.Zero, windowName);
            if (windowPtr == IntPtr.Zero)
            {
                Console.WriteLine("Window not found");
                return;
            }
            SendMessage(windowPtr, WM_CLOSE, IntPtr.Zero, IntPtr.Zero);
            System.Threading.Thread.Sleep(1000);
        }
    }
}
