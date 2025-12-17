# HubSpot integration

## Data tracked

* GitMesh CE contacts <> HubSpot contacts
* GitMesh CE organizations <> HubSpot companies

Refresh period: every 8 hours

## How to install

Go to the [Integration settings](https://app.GitMesh CE/integrations) and follow the steps to connect HubSpot.

### 1. Connect HubSpot

Select the HubSpot account that you want to connect to GitMesh CE. The HubSpot user should have permissions to these scopes to successfully connect the integration:

* `crm.objects.contacts.read`
* `crm.objects.contacts.write`
* `crm.schemas.contacts.read`
* `crm.objects.companies.read`
* `crm.objects.companies.write`
* `crm.schemas.companies.read`
* `crm.lists.read`
* `crm.lists.write`

### 2. Enable integration for contacts and/or organizations

After connecting HubSpot, integration requires additional setup through the settings drawer. First, select for which entities (contacts and/or organizations) you want to enable the integration for.

#### Data-in

Existing contacts and organizations will automatically be enriched with data points from HubSpot contacts every 8 hours.\
Contacts will be identified using the HubSpot contact e-mails. Organizations will be identified using the HubSpot company name. The integration will only enrich fields that were mapped during initializing the integration.

#### Data-out

To send entities to HubSpot, use Automations or sync entities manually using the contact/organizations context menu, `Sync with HubSpot` menu item.

**Contacts without an e-mail will not be synced to HubSpot.**

**Organizations without a website will not be synced to HubSpot.**

### 3. Map the attributes between GitMesh CE and HubSpot

In the attributes mapping section, you will see all the mappable fields of GitMesh CE. Check the checkbox next to the fields and select the HubSpot field in which you want to map the GitMesh CE field with.

**We recommend creating custom properties in Hubspot for every GitMesh CE attribute.** This will ensure that GitMesh CE won't overwrite already-in-use fields in HubSpot.

To create custom contact properties in HubSpot go to Contacts -> Actions -> Edit properties

To create custom company properties in Hubspot go to Companies -> Actions -> Edit properties

Fields can be mapped only if the type also matches. ie: You can map the`displayName` property to a string HubSpot property or you can map the`score` property to a number HubSpot property.

After creating the properties in HubSpot, click `Update attributes` button on the drawer so that GitMesh CE gets the newly created attributes from HubSpot.

Some fields are read-only calculated fields. These are denoted with a single right-direction arrow. These fields will be pushed to HubSpot (using either automations or manual sync) but data-in will **not** get these fields back into GitMesh CE.

After attribute mapping is done, use the update button to start the data-in integration.

### Syncing entities manually

the After integration status goes into `connected` state, you can start syncing contacts and organizations manually.

You can find `Sync with HubSpot` button using the contacts and organizations context menu.



<figure><img src="../../.gitbook/assets/contact-manual-sync.png" alt=""><figcaption><p>After clicking the button, GitMesh CE will sync the contact to HubSpot immediately and every 8 hours the contact will be synced again, to keep the contact fresh in HubSpot.</p></figcaption></figure>

### Syncing entities using automations

You can also use automations to push data to HubSpot. When contacts or organizations conform to the defined filters, they will be synced to HubSpot automatically.

Go to `settings -> automations -> add automation` to start adding HubSpot automations.

#### Contact automations

Automations for contacts support adding found contacts into HubSpot static lists. These lists should exist before you start creating the automation.

To create a static contact list in HubSpot, go to Contacts -> Lists -> Create List

**You should create a static list, and not a dynamic (active) one**. Dynamic lists are purely managed by HubSpot and HubSpot won't let us add contacts to these lists manually.

Give your list a meaningful name and save it.

Now we're all set to add a HubSpot automation.



<figure><img src="https://files.readme.io/4b2cd48-hubspot-automations.png" alt=""><figcaption></figcaption></figure>

Choose the trigger and set the desired filters.

You can set the logical operator between filters to `Matching all (and)` or `Matching any (or)`

Select the HubSpot list that you just created and click `Add automation`

Upon first creation of the automation, GitMesh CE will sync the existing contacts that were already conforming to the given filters immediately. Every 8 hours the sync will happen again, catching the new entities conforming to the filters and also updating already synced contacts again for changed properties.

#### Organization automations

Quite similar to contact automations with few differences.



<figure><img src="https://files.readme.io/643dcd9-hubspot-organization-automations.png" alt=""><figcaption></figcaption></figure>

After setting the filters, now you can also check the option `Sync all contacts from the organizations matching your conditions criteria`. Checking this will sync all organization contacts found with given filters to HubSpot, also adding these contacts to the selected contact list below.
