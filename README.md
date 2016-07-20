ICS Security Checklist
=======

A web app used to inventorize computing devices in an industrial network, list their potential vulnerabilities and provide recommendations for solving them.

## Usage
1. Select a device used in the industrial network
2. Check all enabled services on this device
3. Add more devices if necessary    
4. Get a summary of all associated warnings per device and ways to fix them

## Dependencies
### Front-end
* HTML5
* JavaScript
* jQuery
* Bootstrap

### Back-end
* MySQL server (InnoDB)
* Node.js
* Express

## Installation
The following is a guide on how to install the ICS Checklist application on a Debian 8.x 64bit server. Similar instructions apply to different operating systems.

### Database
A standalone MySQL installation can be used, though it is recommended to install phpMyAdmin along with it for easy management.

1. Install a LAMP stack:
  ```sh
  sudo apt-get install apache2 mysql-server php5 php-pear php5-mysql -y
  ```

2. Secure the MySQL installation:
  ```sh
  sudo mysql_secure_installation
  ```

3. Install PHPMyAdmin:
  ```sh
  sudo apt-get install phpmyadmin
  ```

4. Open the Apache configuration file:
  ```sh
  sudo nano /etc/apache2/apache2.conf
  ```

5. Add the following line:
  ```sh
  Include /etc/phpmyadmin/apache.conf
  ```

6. Restart the server:
  ```sh
  sudo service apache2 restart
  ```

7. You can now manage the database from your browser on the following address:
  ```
  localhost/phpmyadmin
  ```

8. Login using your MySQL credentials.

9. Create a new database called ```ics_checklist``` and collation ```utf8_bin```.

10. Download the latest version of the database from [the GitHub repository](https://github.com/alexvanmaele/ics-checklist-database)

11. Select the ics-checklist database and go to Import. Select the downloaded .sql file and import it. You should now see several newly created tables.

### Web server
1. Install Node.js:
  ```sh
  curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - && sudo apt-get install -y nodejs
  ```

### Application
1. Clone the repository:
  ```sh
  git clone https://github.com/alexvanmaele/ics-checklist.git && cd ics-checklist
  ```

2. Install all dependencies:
  ```sh
  npm install
  ```

3. Configure database access by editing following file:
  ```sh
  nano routes/api.js
  ```

4. Change the block starting with the ```mysql.createConnection``` function according to your MySQL database credentials.

5. Start the Node.js application:
  ```sh
  npm start
  ```

6. Start using the application from your browser on:
  ```
  localhost:3000
  ```
