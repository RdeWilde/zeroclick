var DEFAULT_PAY_LIMIT = 0.001;

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  //kittenGenerator.requestKittens();

  var walletId = '299df2a7-b0e7-4134-b911-802cd398bb0c';
  var mainPass = 'testtesttest';

  chrome.storage.sync.set(
  {
      walletId: walletId,
      mainPass: mainPass,
  });

  chrome.storage.sync.get(['limit'], function(data) {
    if (data.limit) {
      $('#pay-limit').val(data.limit);
    } else {
      $('#pay-limit').val(DEFAULT_PAY_LIMIT);

      chrome.storage.sync.set({
        limit: DEFAULT_PAY_LIMIT
      });
    }
  });


  $('.qr-expand').click(function() {
    console.log('qr-expand clicked')
    $('#qrcode').toggleClass('hide');
  });

  $('#pay-limit').on('input', function() {
    var limit = $('#pay-limit').val();
    console.log('updating limit to: ', limit);

    chrome.storage.sync.set({
      limit: limit
    });

    chrome.runtime.sendMessage( { setLimit: limit }, function(response) {} );
  });

  var balance;
  var bciUrl = 'https://blockchain.info/merchant/'+walletId+'/balance?password='+mainPass;
  $.ajax({
    type: "GET",
    url: bciUrl,
    async: false,
    data: {},
    success: function(res) {
      balance = res.balance / 100000000;
      $('#balance').text(balance + 'BTC');
    }
  });


  bciUrl = 'https://blockchain.info/merchant/'+walletId+'/list?password='+mainPass;
  $.ajax({
    type: "GET",
    url: bciUrl,
    async: false,
    data: {},
    success: function(res) {
      addr = res.addresses[0].address;
      $("#address").text(addr);
      $("#qrcode").html("<img id='qrImage' src='https://chart.googleapis.com/chart?cht=qr&chs=360x360&chl=bitcoin%3A" + addr + "&chld=H|0'>");
    }
  });
});

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
      console.log(details);
      return {responseHeaders:details.responseHeaders};
  },
  {urls: ["<all_urls>"]},
  ["blocking", "responseHeaders"]);

    function abc() {}
      chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
      console.log(response.farewell);
    });
