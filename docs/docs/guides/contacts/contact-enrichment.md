# Contact enrichment

Contact enrichment populates contact profiles with additional data points automatically. When a contact is enriched, you can gain deep insights into a contact's skills, open-source contributions, education, work experience, and more. Contact enrichment is part of our [Scale and Enterprise plans.](https://www.GitMesh CE/pricing)

The enrichment is based on publicly available information spread across various social platforms.

<figure><img src="https://files.readme.io/b4df211-Member_enrichment_2.png" alt=""><figcaption></figcaption></figure>

### Which contacts can be enriched?

For a contact to be successfully enriched, they must have either a GitHub identity or an email address.&#x20;

### What information do you get about contacts?

We add many attributes (listed below) to contacts and enrich them with their open-source contributions. We can also populate their GitHub, LinkedIn, and Twitter identities and their email field.

### Attributes

* **Location** (string): The contact's location.
* **Job Title** (string): The contact's job title.
* **GitHub URL** (string): The profile URL of the contact on GitHub.
* **LinkedIn URL** (string): The profile URL of the contact on LinkedIn.
* **Twitter URL** (string): The profile URL of the contact on Twitter.
* **Bio** (string): A bio or summary of the contact.
* **Seniority Level** (string): The seniority level of the contact, e.g., Junior, Middle, Senior.
* **Emails** (multiple select): The email addresses associated with the contact.
* **Expertise** (multiple select): The contact's expertise is clustered by topics (including non-technical skills).
* **Skills** (multiple select): The contact's technical skills are based on their OSS contributions. Skills are displayed sorted by relevance (high to low).
* **Country** (string): The contact's country.
* **Programming Languages** (multiple select): The programming languages the contact is proficient in.
* **Languages** (multiple select): The languages the contact is proficient in.
* **Years of Experience** (number): The number of years of work experience the contact has.
* **Education** (JSON): A JSON object containing the following keys:
  * **campus** (string): The contact's campus name.
  * **major** (string): The contact's major.
  * **specialization** (string): The contact's specialization.
  * **startDate** (string): The contact's education start date.
  * **endDate** (string): The contact's education end date (if it has ended). If the contact is still studying, it will be 'Present'.
* **Awards** (multiple select): The contact's awards.
* **Certifications** (JSON): A JSON object containing the following keys:
  * **title** (string): The contact's certification title.
  * **description** (string): The contact's certification description.
* **Work Experiences** (JSON): A JSON object containing the following keys:
  * **title** (string): The contact's job title.
  * **company** (string): The contact's company.
  * **location** (string): The contact's company location.
  * **startDate** (string): The contact's job start date.
  * **endDate** (string): The contact's job end date (if it has ended). If the contact is still working, it will be 'Present'.

{% hint style="danger" %}
Not all of these attributes may be found for every contact.

Our dataset is based on publicly available data from various platforms. Depending on whether a contact has a public profile on these platforms or, for example, always uses an anonymous handle, it may be that we cannot enrich all attributes.
{% endhint %}

### Open Source Contributions

Enrichment provides insights into a contact's open-source contributions and uses this information to create a network graph.

Visualizing a contact's open-source contributions is a powerful way to understand their skills, expertise, and interests in a way that is easy to understand and interact with.

The graph is made up of two main elements:

* **Nodes**: represent the repositories the contact has contributed to. The size of a node is proportional to the number of contributions the contact has made to that repository.
* **Edges**: connect the nodes and represent the relationships between different repositories. Nodes are joined together if they have any repository topics in common, and the thickness of an edge is proportional to the number of topics the two repositories have in common.

<figure><img src="https://files.readme.io/49732f0-Member_enrichment_1.png" alt=""><figcaption></figcaption></figure>

Clicking on a node will give you more information about the repository, including all the topics and the number of contributions. Similarly, clicking on an edge will show all the topics that connect the two repositories.

{% hint style="info" %}
**Will data be overwritten?**

No contact data will not be overwritten from our enrichment feature. Identities and emails will only be added if they do not exist before. All attributes are added so that they will not overwrite any pre-existing attributes. If we have the same attribute coming from any integration and enrichment, both will be stored, but the one from the integration will show up in the app.
{% endhint %}
