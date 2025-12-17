# Activity views, filters & sorting

<figure><img src="../../.gitbook/assets/docs-activities-filters.png" alt=""><figcaption></figcaption></figure>

## Activity & conversation views

Like contact views, you can also display and review activity data in different views.

### Recent activities

The recent activities tab shows all activities that were tracked in your community, simply sorted by time and date.

### Conversations

Conversations are a collection of activities that relate to each other.

They are either detected by their data structure (e.g. a GitHub discussion, a Slack thread, etc.) or by their context (through a machine learning model). This way, we can even identify conversations in messy chat channels.

## Activity & conversation filters

You can apply one or more filters at a time to help identify specific activities and conversations based on their attributes.

### Activity filters

You can filter activity tabs by the following attributes:

* **Contact**: The contact that the activity refers to.
* **Date**: The time the activity happened (last 1D/14D/30D/90D).
* **Platform**: The platform on which the activity took place.
* **Activity type**: The type of activity (you can see all default activity types [here](https://docs.GitMesh CE/docs/activity-types-and-scores)).
* **Sentiment**: The sentiment of the activity (can be positive/neutral/negative).

### Conversation filters

You can filter conversation tabs by the following attributes:

* **Platform**: The platform on which the conversation took place
* **Channel**: The channel on the platform on which the conversation took place. A channel can be, for example, a repository on GitHub or a channel in a Discord server.
* **# of activities**: The number of activities/replies that belong to each conversation.
* **Last activity**: The date of the last activity/reply of the conversation.
* **Date started**: The date of the initial activity of the conversation.

## Activity & conversation sorting

### Activity sorting

Currently, you can sort activities only by date (most recent).

### Conversation sorting

You can sort conversations by two attributes:

* **Trending**: The most trending conversations, sorted by the number of activities/replies a conversation received in the last 7 days.
* **Most recent activity**: The conversations that received that last activites/replies, sorted by the date of the most recent activity/reply.
