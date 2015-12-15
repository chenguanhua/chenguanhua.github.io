var flag="frame";
		
$(function(){
	$('#wrap').css({'transform': 'translateZ(-401px) translateX(50%)', 'z-index': '0'});
	if(window.localStorage.getItem("backFromModules")=="true"){
		$('#wrap').css({'transform': 'translateY(-50%)'});
		$('#frame').css({'transform': 'translateZ(401px) translateY(-50%)'});
		window.localStorage.setItem("backFromModules", false);
		flag="modules";
	}
	$('#initialMenu').css('width',$('#initialMenu').height());
	$('#chartWrap').css('top',$('#chartWrap').css('left'));
	$('#chart').css('top',$('#chart').css('left'));
});
		
function test(){
	if(flag=="frame"){
		$('#wrap').css({'transform': 'translateY(-50%)', 'transition':'transform 2s ease-in-out'});
		$('#frame').css({'transform': 'translateZ(401px) translateY(-50%)', 'transition':'transform 1s ease-in-out','filter':'blur(5px)'});
		flag="modules";
	}else{
		$('#wrap').css({'transform': 'translateZ(-401px) translateX(50%)', 'transition':'transform 1s ease-in-out','filter':'blur(5px)'});
		$('#frame').css({'transform': 'translateY(-50%)', 'transition':'transform 2s ease-in-out'});
		flag="frame";
	}
}

function backToPanel(backFromModules){
	window.localStorage.setItem("backFromModules", backFromModules);
	window.location.href = "index.html";
}



