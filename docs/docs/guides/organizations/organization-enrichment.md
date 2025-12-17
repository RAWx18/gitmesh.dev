# Organization enrichment

Organization enrichment automatically populates organizations represented in your community with additional data points. When an organization is enriched, you will see valuable details such as company size, industry, description, location, and more.

The enrichment is based on publicly available information.

## How do you enrich an organization?

Organization enrichment is available for users in our Scale and Enterprise plans (find out more about our plans [here](https://www.GitMesh CE/pricing)). Once one of these plans is active, organization enrichment occurs automatically.

In our Scale plan, you will have up to 200 automatic enrichments a month, in Enterprise, it depends on your plan. We prioritize companies that are new and whose members are the most active in your community.

## How to see all enriched organizations?

To see which organizations are enriched, you can use the filter "enriched organization" and choose "true" from the dropdown. Conversely, if you want to see organizations that are yet to be enriched, choose "false".

## What information do you get about organizations?

We add the following data points to the organization profile:

* **Headline** (string): A succinct one-liner on the organization.
* **Description** (string): A more elaborate depiction of the organization's activities.
* **Identities** (string): Organization profiles on other platforms, such as Twitter, LinkedIn, and Crunchbase.
* **Industry** (string): The company's operational field, e.g., "Computer Software".
* **Number of employees** (string): A precise headcount working for the organization.
* **Number of employees by country** (string): The number of current employees broken out by country.
* **Location** (string): The organization's geographical site.
* **Founded** (string): The year the company was established.
* **Type** (string): Indicates whether the organization is private or public.
* **Size** (string): A ballpark estimate of employee numbers.
* **Affiliated profiles** (array of string): Linked organizations or profiles affiliated with the company.
* **All subsidiaries** (array of string): every company owned by the organization.
* **Alternative domains** (array of string): A list of alternate domains associated with this company.
* **Alternative names** (array of string): Other names the organization is known by.
* **Average employee tenure** (float): The average years of experience at the company.
* **Average tenure by level** (json): The average years of experience at the company by job level.
* **Average tenure by role** (json): The average years of experience at the company by job role.
* **Direct subsidiaries** (array of string): Directly controlled subsidiary companies of the organization.
* **Employee churn rate** (json): Rate at which employees are leaving the organization on a regular basis.
* **Employee count by month** (json): The number of employees at the end of each month.
* **Employee growth rate** (json): The growth rate of the organization's employees.
* **Employee count by month by level** (json): The number of employees at the end of each month, broken down by job level.
* **Employee count by month by role** (json): The number of employees at the end of each month, broken down by job role.
* **GICS sector** (string): GICS standard sector classification for public companies.
* **Gross additions by month** (json): The total number of profiles that joined the company each month.
* **Gross departures by month** (json): The total number of profiles that left the company each month.
* **Ultimate parent** (string): Ultimate holding company or entity of the organization.
* **Immediate parent** (string): The parent company or entity that directly controls the organization.

{% hint style="info" %}
Not all of these attributes may be found for every organization.

Our dataset is based on publicly available data from various platforms. Depending on what information is available, we may not enrich all attributes for all organizations.
{% endhint %}
