let tiempoLimite = 0;

onmessage = function(e) {
  tiempoLimite = e.data.tiempoLimite;
  let tiempoRestante = tiempoLimite;

  const intervalo = setInterval(() => {
    tiempoRestante--;
    if (tiempoRestante <= 0) {
      clearInterval(intervalo);
      postMessage("tiempoAgotado");
    }
  }, 1000);
};
