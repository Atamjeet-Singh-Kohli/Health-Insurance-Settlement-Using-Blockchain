from django.db import models
from django.utils import timezone


# Create your models here.

class Doctor(models.Model):
    fName = models.CharField(max_length=50)
    lName = models.CharField(max_length=50)
    Doj = models.DateTimeField()
    emailID = models.EmailField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    docID = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    image = models.ImageField(upload_to='images/', name=docID.name)

    def __str__(self):
        return self.fName


class Patient(models.Model):
    patID = models.CharField(max_length=100)
    patName = models.CharField(max_length=100)

    def __str__(self):
        return self.patName


class Appointment(models.Model):
    date = models.DateField()
    department = models.CharField(max_length=100)
    docID = models.CharField(max_length=100)
    docName = models.CharField(max_length=100)
    patID = models.CharField(max_length=100)
    patName = models.CharField(max_length=100)
    time = models.TimeField()
    status = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.id}"


class Agency(models.Model):
    aID = models.CharField(max_length=100)
    iName = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    phone = models.BigIntegerField(max_length=15)


class Bill(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    billID = models.CharField(max_length=10)
    date = models.DateTimeField(default=timezone.now())
