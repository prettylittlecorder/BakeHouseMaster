using BakeHouseWebAPI.Models;
using Dapper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Transactions;
using System.Web.Http;

namespace BakeHouseWebAPI.Controllers
{
    public class BakeHouseController : ApiController
    {
        private readonly IDbConnection trvCon = new SqlConnection(ConfigurationManager.ConnectionStrings["BHTestEntities"].ConnectionString);

        [HttpGet]
        [Route("api/bakedhouse/getbakeditems")]
        public IHttpActionResult GetBakedItems()
        {
            List<BakedItem> bakedItems = trvCon.Query<BakedItem>("spGetItemList", commandType: CommandType.StoredProcedure).ToList();

            if (bakedItems == null)
            {
                return BadRequest();
            }

            return Ok(bakedItems);
        }

        [HttpGet]
        [Route("api/bakedhouse/getbakedhouseinvoices")]
        public IHttpActionResult GetBakedHouseInvoices()
        {
            
            List<Invoice> invoices = trvCon.Query<Invoice>("spGetInvoiceList", commandType: CommandType.StoredProcedure).ToList();

            if (invoices == null)
            {
                return BadRequest();
            }

            return Ok(invoices);
        }

        [HttpPost]
        [Route("api/bakedhouse/setinvoice")]
        public IHttpActionResult SetInvoice([FromBody] OrderData orderData)
        {
            var response = new ResponseMsg();

            List<CartItem> cartItems = orderData.CartItems;
            if (cartItems == null || cartItems.Count == 0)
            {
                return BadRequest("No cart items provided.");
            }

            using (TransactionScope scope = new TransactionScope())
            {
                try
                {
                    // Convert the list of CartItem objects to a DataTable
                    var dataTable = new DataTable();
                    dataTable.Columns.Add("numItemID", typeof(int));
                    dataTable.Columns.Add("defaultUnit", typeof(int));

                    foreach (var cartItem in cartItems)
                    {
                        dataTable.Rows.Add(
                            cartItem.numItemID,
                            cartItem.defaultUnit
                        );
                    }

                    // Use Dapper to call the stored procedure with the DataTable as a parameter
                    // Assuming "CartItemType" matches your SQL table type
                    var parameters = new DynamicParameters();
                    parameters.Add("@CartItems", dataTable.AsTableValuedParameter("CartItemType"));
                    parameters.Add("@TotalBill", orderData.TotalBill, DbType.Double, ParameterDirection.Input);
                    parameters.Add("@varCustomerName", orderData.Customer.customerName, DbType.String, ParameterDirection.Input);
                    parameters.Add("@varCustomerAddress", orderData.Customer.customerAddress, DbType.String, ParameterDirection.Input);
                    parameters.Add("@varCustomerContact", orderData.Customer.customerContact, DbType.String, ParameterDirection.Input);
                    parameters.Add("@varRemarks", orderData.Customer.customerRemarks, DbType.String, ParameterDirection.Input);
                    parameters.Add("@varPaymentMode", orderData.Customer.paymentMode, DbType.String, ParameterDirection.Input);
                    parameters.Add("@OutputParam", dbType: DbType.String, direction: ParameterDirection.Output, size: 20);
                    

                    trvCon.Execute("spSetInvoice", parameters, commandType: CommandType.StoredProcedure);

                    response.varResponseMessage = parameters.Get<string>("@OutputParam");

                    if (response.varResponseMessage != "Successful")
                    {
                        scope.Dispose();
                        return Ok(response);
                    }
                    else {
                        scope.Complete();
                        response.varResponseMessage = "Order placed successfully";
                    }
                }
                catch (Exception ex)
                {
                    scope.Dispose();
                }
            }
            return Ok(response);

        }
    }
}