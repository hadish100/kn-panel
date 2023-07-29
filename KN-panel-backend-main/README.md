# KN-panel-backend
backend of panel for managing the marzban panel's for multiple managers

# admin panel

## admin stuff

### admin settings
> some things that we can change as an admin for ourselves

| admin things                    | Description                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| ADMIN_USERNAME                  | name for panel that we can know which panel is this                                                   |
| ADMIN_PASSWORD                  | panel dashbourd url for working with it                                                               |

### admin show logs

panel should have live logger section this should be api too 
it should contain what ever happens from admin adding panels and managers to managers making small changes for their users
panel loger should be so orgenized that we can search for actions like search for manager mr.X created users so it should returns us such orgenized log that we could do that search or filtering thing 
this logging system should contain these logs for at least 15 days ago and the others can get deleted so cache gets deleted

### admin analytics
> AN = analytics & PNL = marzban panel & MNG = panel's managers
> 
> some analytics should be returned from backend for us

| analytics features                 | Description                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| AN_ALL_PNL_TRAFFIC_USAGE_DAY       | analytics for show how much traffic have been used in that day totaly from all panels ( it should get save for all days no exeption )                                                                                                                   |
| AN_ALL_PNL_TRAFFIC_USAGE_WEEK      | analytics for show how much traffic have been used in that day totaly from all panels ( it should get save for all days no exeption )                                                                                                                   |
| AN_ALL_PNL_TRAFFIC_USAGE_MONTH     | analytics for show how much traffic have been used in that day totaly from all panels ( it should get save for all days no exeption )                                                                                                                   |

## marzban panels

### marzban panels features
> PNL = marzban panel
> 
> for limit's if we request -1 it means that we dont want the limit to work and its unlimied on that

| marzban panel features          | Description                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| PNL_NAME                        | name for panel that we can know which panel is this                                                   |
| PNL_URL                         | panel dashbourd url for working with it                                                               |
| PNL_USERNAME                    | panel's username for login                                                                            |
| PNL_PASSWORD                    | panel's password for login                                                                            |
| PNL_COUNTRY                     | panel's country ( if there were multiple panels from that country it should be valued with number like germany-1 germany-2 germany-3 ... )                                                                                                                 |
| PNL_USER_MAX_COUNT              | most user count that the panel should have                                                            |
| PNL_USER_MAX_DATE               | max duration that we can make for user's in panel                                                     |
| PNL_DEACTIVE_AUTO_DELETE_TIME   | disabled users status,expired users status and limited users status limit time for getting deleted                     e for pane                                                                                                                                    |
| PNL_TRAFFIC_LIMIT               | panel's traffic limit                                                                                 |
| PNL_TRAFFIC_ADDER               | for adding more traffic to panel                                                                      |
| PNL_TRAFFIC_REDUCER             | for reduccing panel's traffic                                                                         |
| PNL_DISABLE                     | turns off all of the user's of the panel                                                              |

### marzban panels infos
> these will be used in admin panel for showing some info of the panels to the admin

| marzban panels infos             | Description                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| SHOW_PNL_STATUS                  | boolian for showing if the login to panel is sucessfull or not                                        |
| SHOW_PNL_SITUATION               | boolian for showing if panel is active or disabled                                                    |
| SHOW_PNL_LIMITED                 | boolian for showing if panel is limit is hitted or not                                                |
| SHOW_PNL_TRAFFIC_USAGE           | show's the marzban panel traffic usage                                                                |
| SHOW_PNL_TRAFFIC_LIMIT           | show's the marzban panel traffic limit                                                                |
| SHOW_PNL_TRAFFIC_REMAINING_LIMIT | show's the marzban panel remaining traffic limit                                                      |
| SHOW_PNL_ALL_USERS               | show's the marzban panel all users count                                                              |
| SHOW_PNL_DEACTIVE_USERS          | show's the marzban panel all disabled users status,expired users status and limited users status users count                                                                                                                                              |
| SHOW_PNL_MEMORY                  | show's the marzban panel memory                                                                       |
| SHOW_PNL_MEMORY_USAGE            | show's the marzban panel memory usage                                                                 |

## manager's features

### manager's features
> MNG = panel's managers
> 
> for limit's if we request -1 it means that we dont want the limit to work and its unlimied on that

| managers features               | Description                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| MNG_NAME                        | name for manager that we can know which manager is this                                               |
| MNG_USERNAME                    | manager's username for login                                                                          |
| MNG_PASSWORD                    | manager's password for login                                                                          |
| MNG_PREFIX                      | manager's prefix that will be for every user's names                                                  |
| MNG_COUNTRYS_LIMIT              | manager's countrys limit that can only access to some panel's and can get only from some panel's which we want our manager to get ( if it was only the name of a country given then its all of the panels of that country else it should be like germany-1 , netherlands-2 , ...)                                                                                                                      |
| MNG_COUNTRY_ADD                 | for adding to managers country limit ( if it was only the name of a country given then its all of the panels of that country else it should be like germany-1 , netherlands-2 , ...)                                                                      |
| MNG_COUNTRY_REDUCER             | for reduccing the countrys that are in MNG_COUNTRYS_LIMIT of manager panel ( if it was only the name of a country given then its all of the panels of that country else it should be like germany-1 , netherlands-2 , ...)                          |
| MNG_USER_MAX_COUNT              | most user count that the manager should have                                                          |
| MNG_USER_MAX_DATE               | max duration that manager can make for user's in panel                                                |
| MNG_DEACTIVE_AUTO_DELETE_TIME   | disabled users status,expired users status and limited users status limit time for getting deleted    |
| MNG_TRAFFIC_LIMIT               | manager traffic limit                                                                                 |
| MNG_TRAFFIC_ADDER               | for adding more traffic to manager's panel                                                            |
| MNG_TRAFFIC_REDUCER             | for reduccing manager's panel traffic                                                                 |
| MNG_DISABLE_CONTROL             | turns off creating and deleting and editing users option for manager                                  |
| MNG_DISABLE                     | turns off all of the user's of the manager and creating and deleting and editing users option for manager                                                                                                                                                 |

 MNG_PREFIX will be for every user that this panel is going make 
 example : if the manager's prefix is ban and manager wants to make a vpn named ahmad then the name on the marzban panel is going to be ban_ahmad 
 
 the name will be : MNG_PREFIX + _ + name = MNG_PREFIX_name

### manager's features
> these will be used in admin panel for showing some info of the managers to the admin

| managers infos                   | Description                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| SHOW_MNG_CONROL_STATUS           | boolian for showing if MNG_DISABLE_CONTROL is true or not                                             |
| SHOW_MNG_SITUATION               | boolian for showing if manager is active or disabled                                                  |
| SHOW_MNG_TRAFFIC_USAGE           | show's the manager's traffic usage                                                                    |
| SHOW_MNG_TRAFFIC_LIMIT           | show's the manager's traffic limit                                                                    |
| SHOW_MNG_TRAFFIC_REMAINING_LIMIT | show's the manager's remaining traffic limit                                                          |
| SHOW_MNG_ALL_USERS               | show's the manager's all users count                                                                  |
| SHOW_MNG_DEACTIVE_USERS          | show's the manager's all disabled users status,expired users status and limited users status users count                                                                                                                                                  |

# managers panel
typing ...
