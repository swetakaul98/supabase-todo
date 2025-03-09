// // Simulating a real database of users and their orders
// const users = [
//   {
//     id: 1, name: 'John Doe', email: 'john@example.com', premium: true,
//   },
//   {
//     id: 2, name: 'Jane Smith', email: 'jane@example.com', premium: false,
//   },
// ];

// const orders = [
//   {
//     id: 101, userId: 1, amount: 200, status: 'delivered', date: '2024-02-10',
//   },
//   {
//     id: 102, userId: 1, amount: 300, status: 'pending', date: '2024-02-14',
//   },
//   {
//     id: 103, userId: 2, amount: 150, status: 'delivered', date: '2024-02-13',
//   },
// ];

// // Database layer functions
// function findUserById(id) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const user = users.find((u) => u.id === id);
//       if (user) {
//         resolve(user);
//       } else {
//         reject(new Error('User not found'));
//       }
//     }, 300); // Simulating DB latency
//   });
// }

// function findOrdersByUserId(userId) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const userOrders = orders.filter((o) => o.userId === userId);
//       resolve(userOrders);
//     }, 500); // Simulating DB latency
//   });
// }

// // Your task: Complete this function
// // async function getUserOrderSummary(userId) {
// //   let user = await findUserById(userId)
// //   let userOrder = await findOrdersByUserId(userId)
// //   console.log(user,'user', userOrder, 'userOrdern')
// //   let totalAmt = 0;
// //   let returnObj = {
// //     userName: user.name,
// //     orderNos: userOrder.length,
// //     // Basic reduce syntax:
// //     // array.reduce((accumulator, currentValue) => {
// //     //   return accumulator + currentValue;
// //     // }, initialValue);
// //     totalAmt: userOrder.reduce((accumulator, currentValue)=>{
// //       return accumulator + currentValue.amount;
// //     }, 0),
// //     status: user.premium,
// //     orders: userOrder.sort((a, b) => {
// //       const dateA = new Date(a.date);
// //       const dateB = new Date(b.date);
// //       return dateA - dateB;
// //     })
// //   }
// //   console.log(returnObj,'returnObj')
// //   return returnObj;
// //   // 1. Get user details
// //   // 2. Get their orders
// //   // 3. Calculate total spent
// //   // 4. Return summary including:
// //   //    - User name
// //   //    - Total number of orders
// //   //    - Total amount spent
// //   //    - Premium status
// //   //    - List of orders sorted by date
// // }

// // async func return promise so we cant directly console
// // async function getProcessedData() {
// //   const a = await getUserOrderSummary(1);
// //   console.log(a, 'async a');
// // }

// // Promise.all to reduce time, so it calls simultaneosy both func and give res.
// async function getUserOrderSummary(userId) {
//   try {
//     const [user, userOrder] = await Promise.all([
//       findUserById(userId),
//       findOrdersByUserId(userId),
//     ]);

//     const returnObj = {
//       userName: user.name,
//       orderNos: userOrder.length,
//       totalAmt: userOrder.reduce((acc, curr) => acc + curr.amount, 0),
//       status: user.premium,
//       orders: userOrder.sort((a, b) => new Date(a.date) - new Date(b.date)),
//     };

//     return returnObj;
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     throw error; // Re-throw to handle it in the calling function
//   }
// }
// getUserOrderSummary(1).then((res) => {
//   console.log(res, 'res then');
// });
// // Before optimization
// // async function getDashboardData(userId) {
// //   const user = await dbQuery("SELECT * FROM users WHERE id = ?", [userId]);
// //   const orders = await dbQuery("SELECT * FROM orders WHERE user_id = ?", [userId]);
// //   const preferences = await dbQuery("SELECT * FROM preferences WHERE user_id = ?", [userId]);
// //   return { user, orders, preferences };
// // }

// // After optimization
// async function getDashboardData(userId) {
//   try {
//     // Run all queries in parallel with timeout and caching
//     const [user, orders, preferences] = await Promise.all([
//       getDataFromDB({ type: 'user', id: userId }),
//       getDataFromDB({ type: 'orders', userId }),
//       getDataFromDB({ type: 'preferences', userId }),
//     ]);

//     return { user, orders, preferences };
//   } catch (error) {
//     console.error('Error fetching dashboard data:', error);
//     throw error;
//   }
// }

// // async await timing+++++++++
// // Block A - Sequential
// async function getData() {
//   const user = await fetchUser(); // Wait for user first
//   const orders = await fetchOrders(); // Then start orders
//   return { user, orders };
// }

// // Block B - Parallel
// // async function getData() {
// //   const userPromise = fetchUser();     // Start user fetch
// //   const ordersPromise = fetchOrders(); // Start orders fetch immediately
// //   const user = await userPromise;      // Wait for results
// //   const orders = await ordersPromise;
// //   return { user, orders };
// // }
// // The key difference is performance:

// // Block A: Takes total time of both requests (e.g., 300ms + 500ms = 800ms)
// // Block B: Takes time of slowest request only (e.g., max(300ms, 500ms) = 500ms)
// // Because Block B starts both requests immediately without waiting.

// // Promise.race
// async function orderFood() {
//   const restaurant1 = new Promise((resolve) => {
//     setTimeout(() => {
//       console.log('Restaurant 1: Food ready!');
//       resolve('Pizza');
//     }, 2000);
//   });

//   const restaurant2 = new Promise((resolve) => {
//     setTimeout(() => {
//       console.log('Restaurant 2: Food ready!');
//       resolve('Burger');
//     }, 1500);
//   });

//   // We'll take whoever delivers first
//   const firstDelivery = await Promise.race([restaurant1, restaurant2]);
//   console.log('Eating:', firstDelivery);
//   // Even though Restaurant 1 finishes later, we already started eating!
// }

// orderFood();
// // After 1.5 seconds: "Restaurant 2: Food ready!"
// // Immediately after: "Eating: Burger"
// // After 2 seconds: "Restaurant 1: Food ready!" (but we already ate!)

// // Timeout promise: when u dont want to wait for msx this time
// async function timeoutPromise(promise, ms) {
//   // Takes two parameters:
//   // - promise: The operation we want to run
//   // - ms: Maximum time we'll wait (in milliseconds)
//   // Create a promise that rejects after ms milliseconds
//   const timeoutPromise = new Promise((_, reject) => {
//     // We only use reject (not resolve) so we use _ for first parameter
//     setTimeout(() => reject(new Error('Operation timed out')), ms);
//   });
//     // Usage example:
//   try {
//     const result = await timeoutPromise(fetchData(), 5000);
//     console.log('Success:', result);
//   } catch (error) {
//     if (error.message === 'Operation timed out') {
//       console.log('Operation took too long!');
//     } else {
//       console.log('Operation failed:', error);
//     }
//   }
//   // Race between our promise and timeout
//   return Promise.race([promise, timeoutPromise]);
// }

// // Interview Questions:
// // Fix this code to log numbers in sequence: 1, 2, 3
// async function broken() {
//   console.log(1);
//   setTimeout(async () => {
//     console.log(2);
//   }, 0);
//   console.log(3);
// }
// // ams
// // Convert setTimeout to a Promise
// // async function broken() {
// //   console.log(1);
// //   await new Promise(resolve => {
// //     setTimeout(() => {
// //         console.log(2);
// //         resolve();
// //     }, 0);
// //   });
// //   console.log(3);
// // }
// broken();

// /// / Implement a function that:
// // 1. Fetches user data
// // 2. Has a timeout
// // 3. Retries 3 times if it fails
// // 4. Caches the result
// // Cache is like a temporary storage
// // const cache = new Map();  // Map is like an object but better for caching
// // Store in cache
// // cache.set('key', 'value');
// // // Get from cache
// // cache.get('key');  // returns 'value'
// // // check in cache
// // cache.has('key')

// const cache = new Map();
// async function fetchUserWithRetry(userId) {
//   try {
//     // First check cache
//     if (cache.has(userId)) {
//       console.log('Getting from cache!');
//       return cache.get(userId);
//     }
//     let user;
//     for (let i = 0; i < 3; i++) {
//       const timeoutPromise = new Promise((_, reject) => {
//         setTimeout(() => { reject(new Error('timeout')); }, 500);
//       });
//       user = await Promise.race([
//         await findUserById(userId),
//         timeoutPromise,
//       ]);
//       if (user) {
//         cache.set(userId, user);
//         console.log('Cached new data:', cache);
//         return user;
//       }
//     }
//     // Your implementation here
//   } catch (err) {
//     console.log(`Attempt ${attempt + 1} failed`);
//     if (attempt === 2) { // Last attempt
//       throw error; // Give up after 3 attempts
//     }
//   }
// }
// fetchUserWithRetry(1);
