# 🐞 How to report issues

Team members should report issues in Linear. If the issue is part of an active project, assign it to that project and talk to the project owner. Otherwise, how we treat the issue will depend on its priority.

When writing issues, be as descriptive as possible to avoid back-and-forth communication after. Some guidelines:

* Add a title that lets an informed reader understand the issue without opening it.
* Add a description that explains the issue in detail. It should give some context, such as why we must do this. If you are an engineer and you understand the context, get technical.

If you are reporting a bug, add steps to reproduce it. Looms and screenshots will be your friends here!

#### When should an issue be synced with GitHub?

We use Cal.com's [SyncLinear](https://synclinear.com) to sync GitHub issues to Linear and vice-versa. If we add the _Public_ label to a Linear issue.

If the issue has no privacy constraints, such as customer data or tricky screenshots, we can always add it as _Public_.

### Priorities for issues

| Type of Issue                                                            | Priority                                                                                                                                                                 |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bug in Critical Features (Login, Integrations, etc)                      | [![](https://img.shields.io/badge/-Urgent-red)](https://github.com/calcom/cal.com/issues?q=is:issue+is:open+sort:updated-desc+label:Urgent)                              |
| Bug in Core Features (Home, Members, Organizations, Activities, Reports) | [![](https://img.shields.io/badge/-High%20Priority-orange)](https://github.com/calcom/cal.com/issues?q=is:issue+is:open+sort:updated-desc+label:%22High+priority%22)     |
| Confusing UX (but it's working)                                          | [![](https://img.shields.io/badge/-Medium%20Priority-yellow)](https://github.com/calcom/cal.com/issues?q=is:issue+is:open+sort:updated-desc+label:%22Medium+priority%22) |
| Minor improvements                                                       | [![](https://img.shields.io/badge/-Low%20Priority-green)](https://github.com/calcom/cal.com/issues?q=is:issue+is:open+sort:updated-desc+label:%22Low+priority%22)        |

#### **High or urgent priority**

When raising a high or urgent priority issue, if it's unclear who should tackle it, create the issue and assign it to Joan. He will then re-assign it if needed. If you are an engineer and the issue is in one of your areas of knowledge, provide an estimate.

* **Priority**: Urgent or High.
* **Assign:** Joan, or if you know who should tackle it, them.
* **Label**: Usually _Bug_, but could also be _Improvement_.
* **Estimate**: Provide an estimate if you can. Otherwise, leave it blank.

#### Medium or low-priority issues

Medium or low-priority issues can go straight to the backlog and stay unassigned.

* **Priority**: Medium or Low.
* **Assign**: No one
* **Label**: Usually _Improvement_ or _Feature_, but it could also be _Bug_.

### Area of ownership

Each issue should be marked with its area of ownership. This is crucial to organize them. There are labels created for that in Linear. Please refer to the [areas-of-ownership.md](areas-of-ownership.md "mention") for a description of each area, if you need. If you are still unsure, ask the Product Lead.

### Issues by the community

Community members can raise issues in GitHub. The person in charge of support should give a first reply acknowledging the issue and thanking the contributor for opening it.

To send the issue to Linear, add the _Linear_ label in GitHub. Then follow the same priority-based procedure as with issues opened directly in Linear, and add an Area of Ownership.
