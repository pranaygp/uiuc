# UIUC [![Build Status](https://travis-ci.org/pranaygp/uiuc.svg?branch=master)](https://travis-ci.org/pranaygp/uiuc)

A JS wrapper for U of I's Course Schedule/Catalog API

## Installation

```Bash
$ npm install --save uiuc
```

## Usage

This project uses some of the more popular ES6 features like Classes, Promises and arrow functions.

import or require it

```Javascript

import uiuc from 'uiuc' // ES6 Syntax

var uiuc = require('uiuc').default

```

Read the API Docs below for more information on how to use it

## API

> Don't use the constructors of any Classes. This won't get real data. They are used internally by a classes own fetch function. Use the fetch function of any class to instantiate it.

### uiuc

#### Static Methods

`getSchedule ( [options] )`

Returns a Promise for a `Schedule` object
You can optionally pass in options to get a more specific object (`Year` / `Term` / `Subject`)

**Options:**

* *year* - (Number | String) - *(optional)* The year for a specific schedule.
* *term* - (String) - *(optional)* The term for a specific schedule. Should be set to one of "spring", "fall", "winter", "summer". Requires `year` parameter to be set.
* *subject* - (String) - *(optional)* The subject code for a specific schedule.  Requires `year` and `term` parameters to be set.
* *active* - (Boolean) - *(optional)* Set to true to only get classes that are currently offered. Set to `false` by default. Requires `year`,  `term` and `subject` parameters to be set.

If you specify any options without specifying its required options, The function will behave as if the specific option wasn't passed.


### Schedule

* Array [Number] `years`    -> The years for which courses can be looked up

#### Static Methods

`fetch ()`

Returns a Promise for `Schedule` object

#### Methods

`year( [year] )`

Returns a Promise for a `Year` object.

**Parameters**

* *year* - (Number | String) - *(optional)* The year for a specific schedule. If set to "DEFAULT" or undefined, the latest year is used

### Year

* Number `year`             -> The current Year
* Array [String] `terms`    -> The terms for which courses can be looked up

#### Static Methods

`fetch ( options )`

Returns a Promise for a `Year` object.

**Options**

* *year* - (Number | String) - *(optional)* The year for a specific schedule. If set to "DEFAULT" or undefined, the latest year is used

#### Methods

`term( [term] )`

Returns a `Term` object.

**Parameters**

* *term* - (String) - *(optional)* The term for a specific schedule. Should be set to one of "spring", "fall", "winter", "summer" or "DEFAULT". If set to "DEFAULT" or undefined, the latest term is used.

### Term

* Number `year`             -> The current Year
* String `term`             -> The current Term
* Array [String] `subjects` -> The subjects for which courses can be looked up

#### Static Methods

`fetch ( options )`

Returns a Promise for a `Term` object.

**Options**

* *year* - (Number | String) - *(optional)* The year for a specific schedule. If set to "DEFAULT" or undefined, the latest year is used
* *term* - (String) - *(optional)* The term for a specific schedule. Should be set to one of "spring", "fall", "winter", "summer" or "DEFAULT". If set to "DEFAULT" or undefined, the latest term is used.

#### Methods

`subject( subject , [active])`

Returns a `Subject` object.

**Parameters**

* *subject* - (Object) Search parameters for Subject (need to have either `title` or `code`)
* *active* - (Boolean) - *optional* Return only active courses (currently offered). Set to `false` by default.


### Subject

* Number `year`             -> The current Year
* String `term`             -> The current Term
* String `subject`          -> The current Subject
* String `label`            -> Full title of current Subject
* String `collegeCode`      -> The College Code [No idea what this is]
* String `departmentCode`   -> Department Code
* String `unitName`         -> Name of Unit [Department]
* String `contactName`      -> Department contact name
* String `contactTitle`     -> Department contact title
* String `addressLine1`     -> Department contact address (line 1)
* String `addressLine2`     -> Department contact address (line 2)
* String `phoneNumber`      -> Department contact phone number
* String `websiteURL`       -> Department website
* String `collegeDepartmentDescription`      -> Self Explanatory
* Object `courses`          -> List of courses offered under this subject

#### Static Methods

`fetch ( options )`

Returns a Promise for a `Subject` object.

**Options**

* *year* - (Number | String) - *(optional)* The year for a specific schedule. If set to "DEFAULT" or undefined, the latest year is used
* *term* - (String) - *(optional)* The term for a specific schedule. Should be set to one of "spring", "fall", "winter", "summer" or "DEFAULT". If set to "DEFAULT" or undefined, the latest term is used.
* *subject* - (String) - The subject code for a specific schedule.
* *active* - (Boolean) - *(optional)* Return only active courses (currently offered). Set to `false` by default.

#### Methods

`course( course, active )`

Returns a `Course` object.

**Parameters**

* *course* - (Object) Search parameters for Course (need to have either `title` or `number`)
* *active* - (Boolean) - *optional* Return only active courses (currently offered). Set to `false` by default.


### Course

* Number `year`             -> The current Year
* String `term`             -> The current Term
* String `subject`          -> The current Subject
* String `label`            -> Full title of course
* String `description`      -> Course Description
* String `creditHourse`     -> Number of Credits (Don't assume this is a number)
* String `courseSectionInformation`     -> self Explanatory
* Array<Object> `sections`  -> List of sections for this course

#### Static Methods

`fetch ( options )`

Returns a Promise for a `Course` object.

**Options**

* *year* - (Number | String) - *(optional)* The year for a specific schedule. If set to "DEFAULT" or undefined, the latest year is used
* *term* - (String) - *(optional)* The term for a specific schedule. Should be set to one of "spring", "fall", "winter", "summer" or "DEFAULT". If set to "DEFAULT" or undefined, the latest term is used.
* *subject* - (String) - The subject code for a specific schedule.
* *course* - (String) - The course number.
* *active* - (Boolean) - *(optional)* Return only active courses (currently offered). Set to `false` by default.

#### Methods

`section( section )`

Returns a `Section` object.

**Parameters**

* *section* - (Object) Search parameters for Section (need to have either `section` or `crn`)

### Section

* Number `year`             -> The current Year
* String `term`             -> The current Term
* String `subject`          -> The current Subject
* String `sectionNumber`    -> The section number
* String `creditHourse`     -> Number of credits (Don't expect this to be a number)
* String `statusCode`       -> status code (No idea what this is)
* String `partOfTerm`       -> Part of which term (usually either one of 1, A, B)
* String `sectionStatusCode` -> section status code (No idea what this is)
* String `enrollmentStatus` -> ability to enroll in course
* String `startDate`        -> start date of course (section)
* String `endDate`          -> end date of course (section)
* Array<Object> `meetings`  -> list of meeting objects for course
  * String `type`             -> type of section (Lecture, Discussion, Lab, etc.)
  * String `start`            -> start time
  * String `end`              -> end time
  * String `daysOfTheWeek`    -> which days the section meets (in the form of'TR' or 'MWF' etc)
  * String `roomNumber`       -> room number of venue
  * String `buildingName`     -> building name of venue
  * Array<String> `instructors` -> list of instructors for course

#### Static Methods

`fetch ( options )`

Returns a Promise for a `Section` object.

**Options**

* *year* - (Number | String) - *(optional)* The year for a specific schedule. If set to "DEFAULT" or undefined, the latest year is used
* *term* - (String) - *(optional)* The term for a specific schedule. Should be set to one of "spring", "fall", "winter", "summer" or "DEFAULT". If set to "DEFAULT" or undefined, the latest term is used.
* *subject* - (String) - The subject code for a specific schedule.
* *course* - (String) - The course number.
* *crn* - (String) - The crn.
* *active* - (Boolean) - *(optional)* Return only active courses (currently offered). Set to `false` by default.