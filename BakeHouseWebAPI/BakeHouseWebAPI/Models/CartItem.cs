using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BakeHouseWebAPI.Models
{
    public class CartItem
    {
        public int numItemID { get; set; }
        public string varItemName { get; set; }
        public double numUnitPrice { get; set; }
        public int defaultUnit { get; set; }
        public double numDiscount { get; set; }
    }
}