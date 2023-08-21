using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BakeHouseWebAPI.Models
{
    public class Customer
    {
        public string customerName { get; set; }
        public string customerAddress { get; set; }
        public string customerContact { get; set; }
        public string customerRemarks { get; set; }
        public string paymentMode { get; set; }
    }
}