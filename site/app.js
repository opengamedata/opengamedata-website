// Enable popovers
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
const popoverAllowList = bootstrap.Popover.Default.allowList;

// To allow button elements in Popovers
popoverAllowList.button = [];
