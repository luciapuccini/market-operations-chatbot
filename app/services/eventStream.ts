let controller: AbortController;

const AbortControllerService = () => {
  if (controller) {
    return controller;
  }
  controller = new AbortController();
  return controller;
};

export default AbortControllerService;
