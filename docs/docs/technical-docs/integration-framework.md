---
description: Our integration framework is designed to easily build data-in integrations.
---

# 🔌 Integration framework (WIP)



1. **Starting the Integration:** We begin the integration by creating a record of it and sending a message to start the process.
2. **Generating Streams:** Next, we create various data streams and send messages to start processing them.
3. **Fetching Data from External Sources:** For each stream, we collect data from external sources, store it in our system, and then send messages for further processing.
4. **Data Processing:** We process the collected data, create results, and send messages for additional processing.
5. **Updating Our System:** We process and incorporate the results into our database.

This new framework allows us to track the integration progress more effectively and ensures that any issues during the integration process are mainly due to external sources. With all the necessary data obtained from external sources stored in our system, we can address any errors more efficiently, thus minimizing potential issues for users.

This update enhances the overall stability of our integration systems, providing a better user experience.
