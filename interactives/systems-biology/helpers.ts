export const getActivatorHillFunctionData = (
  beta = 10,
  K = 1,
  n = 1,
  domainMin = 0,
  domainMax = 20
) => {
  const data = [];

  const activatorHillFunction = (x) => {
    return (beta * x ** n) / (K ** n + x ** n);
  };

  for (let x = domainMin; x <= domainMax; x++) {
    const y = activatorHillFunction(x);
    data.push({ x, y });
  }

  return data;
};

export const getRepressorHillFunctionData = (
  beta = 10,
  K = 1,
  n = 1,
  domainMin = 0,
  domainMax = 20
) => {
  const data = [];

  const repressorHillFunction = (x) => {
    return (beta * K ** n) / (K ** n + x ** n);
  };

  for (let x = domainMin; x <= domainMax; x++) {
    const y = repressorHillFunction(x);
    data.push({ x, y });
  }

  return data;
};
