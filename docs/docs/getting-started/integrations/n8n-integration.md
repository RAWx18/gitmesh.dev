---
description: Connect n8n with GitMesh CE to access 5,000+ apps
---

# n8n integration

## How to install

To start using the integration, go to the [Integration settings](https://app.GitMesh CE/integrations) and follow the steps to set up n8n.

## Supported operations

An operation is something an n8n node does, such as getting or sending data. There are two types of operation:

**Triggers** start a workflow in response to specific events or conditions in your services. When you select a Trigger, n8n adds a trigger node to your workflow, with the Trigger operation you chose pre-selected. When you search for a node in n8n, Trigger operations have a bolt icon Trigger icon.

**Actions** are operations that represent specific tasks or actions within a workflow, allowing you to manipulate data, perform operations on external systems, and trigger events in other systems as part of your workflows. When you select an Action, n8n adds a node to your workflow, with the Action operation you chose pre-selected.

### Triggers

The GitMesh CE trigger node allows you to respond to events in GitMesh CE and integrate GitMesh CE with other applications. n8n has built-in support for a wide range of GitMesh CE events, which include new activities and new contacts.

* **New Activity:** This trigger is activated when a new activity happens in your community platforms connected to GitMesh CE. For example, someone starred your repo, sent a message in Discord, etc. You can make this trigger granular. For example, only activate it when someone opens a pull request on GitHub and mentions a specific keyword. On the other side of the spectrum, you can configure this trigger to be a "catch-all", but this setup is not recommended because it will be quite hard to distinguish between different events on n8n side. So, the recommended configuration is to keep this trigger as narrow as possible.
* **New Contact**: This trigger is activated when a new contact joins your community platforms connected to GitMesh CE. In GitMesh CE, a contact is considered anyone who performed at least one action at your community platforms - e.g., joined a Discord server or did something on GitHub (the trigger is activated only once for each user). This trigger can be configured as a "catch-all" (all new contact activities for all active platforms) or only for specific platforms.

### Actions

The GitMesh CE node allows you to automate work in GitMesh CE and integrate GitMesh CE with other applications. n8n has built-in support for a wide range of GitMesh CE features include creating, updating, and deleting contacts, notes, organizations, and tasks.

**Activity**

* **Create or update activity for a contact** - _takes a contact object and information about the activity and creates or updates an activity for this contact in GitMesh CE_
* **Create or update activity** - _takes an activity object and creates or updates an activity in GitMesh CE based on sourceId of activity and platform_

**Contact**

* **Create or update contact** - _takes a contact object and creates or updates a contact in GitMesh CE_
* **Update contact** - _takes a contact object and updates an existing contact in GitMesh CE based on contactId. Fails if the contact doesn't exist._
* **Find task** - _returns a contact object for an existing contact based on contactId. Fails if the contact doesn't exist._
* **Delete contact** - _deletes an existing contact based on contactId. Fails if the contact doesn't exist._

**Organization**

* **Create organization** - _creates a new organization in GitMesh CE_
* **Update organization** - _updates an existing organization in GitMesh CE by `organizationId`. Fails if the organization doesn't exist._
* **Find organization** - _returns an organization object for an existing organization based on `organizationId`. Fails if the organization doesn't exist._
* **Delete organization** - _deletes an existing organization based on `organizationId`. Fails if the organization doesn't exist._

**Note**

* **Create note** - _create a new note in GitMesh CE_
* **Update note** - _updates an existing note in GitMesh CE by `noteId`. Fails if the note doesn't exist._
* **Find note** - _returns a note object for an existing note based on `noteId`. Fails if the note doesn't exist._
* **Delete note** - _deletes an existing note based on `noteId`. Fails if the note doesn't exist._

**Task**

* **Create task** - _creates a new task in GitMesh CE_
* **Update task** - _updates an existing task in GitMesh CE by `taskId`. Fails if the task doesn't exist._
* **Find task** - _returns a task object for an existing task based on `taskId`. Fails if the task doesn't exist._
* **Delete task** - _deletes an existing task based on `taskId`. Fails if the task doesn't exist._

**Automation**

* **Create automation** - _creates a new automation workflow in GitMesh CE_
* **Destroy** - _destorys an automation workflow in GitMesh CE_
* **Find** - _returns an automation object for an existing automation based on `automationId`. Fails if the automation doesn't exist._
* **List** - _lists all automation objects in GitMesh CE_
* **Update** - _updates an existing automation in GitMesh CE by `automationID`. Fails if the automation doesn't exist._

## Further links

* [n8n's GitMesh CE integration overview](https://n8n.io/integrations/gitmeshdev)
* [n8n's GitMesh CE action docs](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gitmeshdev/)
* [n8n's GitMesh CE trigger docs](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.gitmeshdevtrigger/)
