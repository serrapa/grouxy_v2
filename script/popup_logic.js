//hi there
chrome.runtime.sendMessage({
        message: "giveme4xx"
    },
    function(response) {
    	console.log("nice!, i've received from bacground this shit", response);
    	if(response['result']){

    		var urls = [];

			console.log("now", response['result']);
    		$.each(response['result'], function(index, value){
    			if(urls.includes(value.url)){
    				return;
    			}
    			urls.push(value.url);

                item = `<li class="border border-dark list-group-item d-flex justify-content-between align-items-center rounded">
                          ${value.url}
                        <span class="badge badge-primary badge-pill initCheck" data-attr-url="${value.url}" data-attr-uuid="${value.evidenceId}">14</span>
                     </li>`;

    			$('.list-group').append(item);
    		});
    	}
    	else{
    		$('.list-group').append(`<br><div class="alert alert-success" role="alert">Nice! no 4xx shit here</div>`);
    	}
        
 	}
);



$(document).on('click','.initCheck',function(){
    var uuid = $(this).attr('data-attr-uuid');
    var url = $(this).attr('data-attr-url');
    //send to background this message
    console.log(uuid, url);

    chrome.runtime.sendMessage({
        message : "start_scan",
        evidenceId : uuid,
        action : 'initCheck',
        urlTarget : url
    }, function(response){
        console.log(response);
    });
});