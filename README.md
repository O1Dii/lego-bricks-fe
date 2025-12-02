```bash
chown -R ubuntu:ubuntu frontend-main
scp -P 32125 -r ./app/* ubuntu@31.130.206.100:/home/ubuntu/frontend-main
chown -R www-data:www-data frontend-main
```
