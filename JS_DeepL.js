var https = require('https');

var post = {
        'jsonrpc': '2.0',
        'method': 'LMT_handle_jobs',
        'params': {
            'jobs': [
                {
                    'kind':'default',
                    'raw_en_sentence': process.argv[2]
                }
            ],
            'lang': {
                'source_lang_user_selected': check_lang(process.argv[3]) || 'EN',
                'target_lang': check_lang(process.argv[4]) || 'ES'
            },
            'priority': -1
        },
};

var post_settings = {
    hostname: 'deepl.com',
    port: '443',
    protocol: 'https:',
    path: '/jsonrpc',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(post))
    }
};

// Guarantees that the language is accepted by DeepL. Otherwise, returns 0
// If it returns 0, a default value will be picked
// In the case of source_lang_user_selected, 'EN'
// In the case of target_lang, 'ES'
function check_lang(lang){
  switch(lang){
    case 'EN':
    case 'ES':
    case 'FR':
    case 'IT':
    case 'DE':
    case 'PL':
    case 'NL': return lang; break;
    default: return 0;
  }
}

var send_req = https.request(post_settings, function(ret){
  ret.on('data', function(data){
    var translations = JSON.parse(data).result.translations[0].beams;
    // If DeepL retrieves any translation
    if(translations[0] != undefined){
      var output = "";
      // The API may return more than one result, which is useful when translating
      // spare words but becomes a problem for whole sentences
      // In order to reduce the results, we'll distinguish between a word and a
      // sentence depending on whether the string has a space (" ") or not
      if (process.argv[2].indexOf(" ") == -1){
        // If it's a single word, we'll return all the results
        for(i in translations){
          output += translations[i].postprocessed_sentence + " ";
        }
      } else {
        // If it's a sentence, we'll return the first result
        output += translations[0].postprocessed_sentence;
      }
      console.log(output);
    } else {
      // If DeepL does not retrieve a translation
      console.log("Translation not available");
    }
    });
});


send_req.write(JSON.stringify(post));
send_req.end();
