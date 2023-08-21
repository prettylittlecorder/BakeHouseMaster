using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BakeHouseWebAPI.Models
{
    public class Invoice
    {
        public string numInvoice { get; set; }
        public string varCustomerName { get; set; }
        public string varCustomerAddress { get; set; }
        public string varCustomerContact { get; set; }
        public string varRemarks { get; set; }
        public string varPaymentMode { get; set; }
        public decimal numInvoiceAmount { get; set; }
        public string dtCreatedOn { get; set; }
    }
}