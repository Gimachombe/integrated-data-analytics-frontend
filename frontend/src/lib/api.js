// // Service Management endpoints
// getServices(params = {}) {
//   const queryString = new URLSearchParams(params).toString();
//   const url = queryString ? `/api/services?${queryString}` : '/api/services';
//   return this.request('GET', url);
// }

// getServiceById(id) {
//   return this.request('GET', `/api/services/${id}`);
// }

// createService(serviceData) {
//   return this.request('POST', '/api/services', serviceData);
// }

// updateService(id, serviceData) {
//   return this.request('PUT', `/api/services/${id}`, serviceData);
// }

// deleteService(id) {
//   return this.request('DELETE', `/api/services/${id}`);
// }

// // Service categories
// getServiceCategories() {
//   return this.request('GET', '/api/services/categories');
// }

// // Service search with filters
// searchServices(filters = {}) {
//   const queryString = new URLSearchParams(filters).toString();
//   const url = `/api/services/search?${queryString}`;
//   return this.request('GET', url);
// }

// // Service availability check
// checkServiceAvailability(serviceId, date) {
//   const queryString = new URLSearchParams({ date }).toString();
//   return this.request('GET', `/api/services/${serviceId}/availability?${queryString}`);
// }

// // Popular services
// getPopularServices(limit = 10) {
//   return this.request('GET', `/api/services/popular?limit=${limit}`);
// }

// // Services by provider
// getServicesByProvider(providerId) {
//   return this.request('GET', `/api/services/provider/${providerId}`);
// }

// // Service reviews
// getServiceReviews(serviceId) {
//   return this.request('GET', `/api/services/${serviceId}/reviews`);
// }

// addServiceReview(serviceId, reviewData) {
//   return this.request('POST', `/api/services/${serviceId}/reviews`, reviewData);
// }

// // Service statistics
// getServiceStatistics(serviceId) {
//   return this.request('GET', `/api/services/${serviceId}/statistics`);
// }

// // Service booking
// bookService(bookingData) {
//   return this.request('POST', '/api/bookings', bookingData);
// }

// // Service pricing options
// getServicePricingOptions(serviceId) {
//   return this.request('GET', `/api/services/${serviceId}/pricing`);
// }