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
                'user_preferred_langs': [
                  process.argv[3] || 'EN',
                  process.argv[4] || 'ES'
                ],
                'source_lang_user_selected': process.argv[3] || 'EN',
                'target_lang': process.argv[4] || 'ES'
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

var send_req = https.request(post_settings, function(ret){
  ret.on('data', function(data){
    var translations = JSON.parse(data).result.translations[0].beams;
    var output = "";
    for(i in translations){
      output += translations[i].postprocessed_sentence + " ";
    }
    console.log(output);
  });
});


send_req.write(JSON.stringify(post));
send_req.end();
