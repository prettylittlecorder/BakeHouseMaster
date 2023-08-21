using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BakeHouseWebAPI.Models
{
    public class BakedItem
    {
        public int numItemID { get; set; }
        public string varItemName { get; set; }
        public string varItemPath { get; set; }
        public double numUnitPrice { get; set; }
        public int numUnit { get; set; }
        public double numDiscount { get; set; }
        public bool isSold { get; set; }
        public int defaultUnit { get; set; }
    }
}