# pH Meter Application

## Highlights
 - Makes running pH dependent experiments for chemistry labs much easier!
 - Displays real time pH readings to a graph to show how the pH level of a substance changes over time.
 - Will have an instruction page to show how to setup an external Arduino pH meter so that it displays on the graph.

## Overview

This project is an independently developed full-stack application designed to allows a postgraduate chemistry lab student to configure line charts to display pH readings from an external Arduino setup. The user will be able to create tests that have these readings associated with them, and update and delete test names and notes to keep each user's tests organized.

The goal is to all up to 12 pH meters to be displayed on the page at once, updating in real time. Currently, the page is setup to display 2 graphs only, but more will be added soon! 

## Demo
[Demo Video](./Screenshots/pH-Meter-Demo-1.gif)




## Technologies Used

- **Frontend:** Angular
- **Backend:** Python, Flask
- **ORM:** SQLAlchemy
- **Database:** MySQL
- **Hardware Integration:** Arduino (USB-based data collection in development)

## Application Architecture

The application uses a full-stack architecture consisting of an Angular frontend, a Flask backend, and a MySQL database.

- **Frontend:** Provides the user interface for managing experiments and interacting with experimental data.
- **Backend:** Handles application logic and database interactions through Flask and SQLAlchemy.
- **Database:** Stores experiment-related information and associated test data.
- **Hardware Integration:** Planned Arduino USB integration will enable the application to receive pH measurements directly from the meter.

## Getting Started

### Prerequisites

The following software is required to run the application:

### Installation

Clone the repository:

```bash
git clone https://github.com/blackjacj/pH_Meter_Web_Application.git
cd <repository-directory>
```

The frontend was generated with Angular CLI version 17.3.17.
#### To run the angular app, enter these into a new terminal

```bash
cd Frontend
ng serve --open
```

## Development Status

This project is actively being developed. Current and planned work includes:

- Arduino USB integration for live pH measurement collection.
- Real-time visualization of pH readings.
- User authentication and access control for individual experiments.

## Author

**Jake Black**

- GitHub: https://github.com/blackjacj
- LinkedIn: www.linkedin.com/in/blackjacj
