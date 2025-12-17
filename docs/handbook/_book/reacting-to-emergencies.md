# 🧰 Reacting to emergencies

Emergencies are anything that does not let our users get any value from the app. They cannot log in, the data is not loading, or integrations fail. Integrations are the most common emergency and will be treated separately.

### General emergencies

In a general emergency, keeping a cool head and communicating are essential.

1. When reporting the emergency, open a Slack thread with the 🚨 reaction. When reporting, try to gather as much information as possible so research can be started in the right direction.
2. Research what the owners and/or experts might be failing, and tag them in the thread.
3. If you are an expert, drop what you are doing and start fixing the emergency.
   * If you are out of the office, find another expert.
   * If you are working on another emergency, find another expert or contact Jonathan or Joan to see which one has more priority.
4. Keep the thread up to date to inform others of what you have tried. This way, we will reach a solution together quicker.

### Integration errors

The goal is always to ensure that we have complete data for all integrations without bothering the user. Even if there are errros.

The integration framework is designed such that if part of an integration fails, the rest will continue to fetch data. If there is an error usually the data loss is minimal. Therefore, it is acceptable to delay the reporting of the error to the user by three days, during which we have time to fix the error and get back the missing data.

When an error occurs, we will get a Slack notification. This error will become top priority for the engineer in charge of integrations. We have three days to fix it, re-deploy, and get the missing data.

### Some guidelines

- Always create a ticket for each issue. When the issue is fixed, add a couple of lines explaining what caused it.
- If errors are piling up, paid customers take priority. Otherwise we can fix them in cronilogical order.
- If some errors will not be fixed in the three days, ask for help!

### Errors caused by a failure of external API

Some errors are caused because the APIs we need to get data are unresponsive. For example, some weeks ago the LinkedIn API was down for several days. In this case, we should inform the user of the problems, and make it clear that we cannot control this, and that they will get their data back.

For this, we have a new integration status, called `external-error`, that will infrom the user of what is happening.

When the API is available again, we must get the missing data.


### Response time and the process of handling errors

Delaying the error notifications relies heavily on two assumptions: we will know when integrations went wrong and have a system in place to fix these issues quickly. I will set up a channel that alerts about faulty integrations in Slack. As soon as we get a message there, Igor will look into the bug and fix it. One of his main responsibilities will be to ensure there are no errored integrations, fix the bugs before we need to alert the user, and set the error type as ********external******** when needed. This task will take priority over any of his other development or growth tasks.
