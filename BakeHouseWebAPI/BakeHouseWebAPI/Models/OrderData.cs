using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BakeHouseWebAPI.Models
{
    public class OrderData
    {
        public List<CartItem> CartItems { get; set; }
        public double TotalBill { get; set; }
        public Customer Customer { get; set; }
    }
}