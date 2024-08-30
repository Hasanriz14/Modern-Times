
## Modern Times
A project utilizing **New York Times API** to render content on the Webpage. <br/>
I wanted to call miNY times but that didn't come to fruition.

### Wanna Try it :)

Well since we're using python better install it :P <br/>
If you're on **Windows** check this out: <br/>

>https://www.python.org/downloads/windows/

If you're on **Linux/UNIX** check this out: <br/>

>https://www.python.org/downloads/source/

If you're on **MacOS** check this out: <br/>
>https://www.python.org/downloads/macos/

### After Python Install

Open Powershell / CMD prompt (Terminal)
check Python version: 

```

python -V

```

check PIP version:

```

pip -V

```

### install Git 

Git is a version control tool. 
It will be needed to run the project

copy this to install git:
```
https://git-scm.com/downloads
```

after install go to the directory where you would run the project:
```
mkdir moderntimes
cd .moderntimes
```

clone the project:
```
git clone https://github.com/Hasanriz14/Modern-Times.git
```

it's better to use a virtual environment than to clutter the main install

Use:
```
python -m venv venv
```

Once that's done 
Do:
```
pip install -r requirements.txt
```

Once everything is installed:
```
uvicorn main:app 
```

#### Done!

If you face any issues do raise issues on the github page. <br/>
This project is still not complete atleast for me so some things might change but the install process will be the same.

#### End Note
Will be focusing on fixing some glaring issues and once I feel satisfied(hopefully) I will stop updating.
