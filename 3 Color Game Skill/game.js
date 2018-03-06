var data = {};
data.life = 3;
data.y = 0;
data.i = Math.floor(Math.random()*10);
data.j = Math.floor(Math.random()*10);
data.score = 0;
var colors = ['yellow','black','red','blue','orange','brown','purple','green','pink','grey'];
				
function main(){	
	var data = fall();
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');	
	context.clearRect(0,0,500,500);
	context.font = "50px Comic Sans MS";
	context.fillStyle = colors[data.i];
	context.fillText(colors[data.j],250, data.y);
}

function fall(){	
				if(data.y === 500){
					data.y = 0;
					data.i = Math.floor(Math.random()*10);
					data.j = Math.floor(Math.random()*10);
					data.life = data.life - 1;
					document.getElementById("Life").innerText = data.life;
					if (data.life < 0){
						alert("Game Over");
						document.location.reload();
					}
				}else{
					data.y = data.y + 50;
					var UserColor = document.getElementById("color").value;
					if (UserColor === colors[data.i]){
						data.score = data.score + 1;
						document.getElementById("Points").innerText = data.score;
						data.y = 0;
						data.i = Math.floor(Math.random()*10);
						data.j = Math.floor(Math.random()*10);
					}
				}
				return data;
}
			
setInterval(function(){main();},1000);