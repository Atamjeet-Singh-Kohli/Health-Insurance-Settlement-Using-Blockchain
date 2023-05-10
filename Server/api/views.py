import random

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import *


# Create your views here.


class DoctorView(APIView):
    def post(self, request):
        serializer = DoctorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            doctor = Doctor.objects.filter(docID=id)
            serializer = DoctorSerializer(doctor, many=True)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response({"status": "success", "data": serializer.data}, status.HTTP_200_OK)

    def delete(self, request, id=None):
        doctor = Doctor.objects.filter(docID=id)
        doctor.delete()

        return Response({"status": "success", "data": True})


class PatientView(APIView):
    def get(self, request, id=None):
        if id:
            patient = Patient.objects.filter(patID=id)
            serializer = PatientSerializer(patient, many=True)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response({"status": "success", "data": serializer.data}, status.HTTP_200_OK)

    def post(self, request):
        serializer = PatientSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class AppointmentView(APIView):
    def post(self, request):

        doctor = Doctor.objects.get(docID=request.data.get('docID'))
        patient = Patient.objects.get(patID=request.data.get('patID'))

        request.data._mutable = True
        request.data['docName'] = doctor.fName + ' ' + doctor.lName
        request.data['patName'] = patient.patName
        request.data._mutable = False

        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response({"status": "success", "data": serializer.data}, status.HTTP_200_OK)

    def put(self, request, id):
        appointment = Appointment.objects.get(id=id)
        appointment.status = True
        appointment.save()
        return Response({"status": "success", "data": appointment.status}, status.HTTP_200_OK)


class AgencyView(APIView):
    def get(self, request, id=None):
        if id:
            agent = Agency.objects.filter(aID=id)
            serializer = AgencySerializer(agent, many=True)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        agents = Agency.objects.all()
        serializer = AgencySerializer(agents, many=True)
        return Response({"status": "success", "data": serializer.data}, status.HTTP_200_OK)

    def post(self, request):
        serializer = AgencySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class BillView(APIView):
    def get(self, request, id=None):
        if id:
            bill = Bill.objects.filter(docID=id)
            serializer = BillSerializer(bill, many=True)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        bills = Bill.objects.all()
        serializer = BillSerializer(bills, many=True)
        return Response({"status": "success", "data": serializer.data}, status.HTTP_200_OK)

    def post(self, request):
        serializer = BillSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getAppointmentDoc(self, id):
    appointment = Appointment.objects.filter(docID=id)
    serializer = AppointmentSerializer(appointment, many=True)
    return Response({"status": "success", "data": serializer.data}, status.HTTP_200_OK)


@api_view(['GET'])
def getAppointmentPat(self, id):
    appointment = Appointment.objects.filter(patID=id)
    serializer = AppointmentSerializer(appointment, many=True)
    return Response({"status": "success", "data": serializer.data}, status.HTTP_200_OK)


@api_view(['GET'])
def getCount(self):
    doctorCount = Doctor.objects.all().count()
    patientCount = Patient.objects.all().count()
    insuranceCount = Agency.objects.all().count()
    billCount = Bill.objects.all().count()
    data = {
        "docCount": doctorCount, "patCount": patientCount, "agentCount": insuranceCount, "billCount": billCount
    }
    return Response({"status": "success", "data": data}, status.HTTP_200_OK)


@api_view(['GET'])
def generateBillId(self):
    while True:
        insID = generateInsID()
        bill = Bill.objects.filter(billID=insID).exists()
        if not bill:
            break
    return Response({"status": "success", "data": insID})


@api_view(['GET'])
def getBillsByPatient(self, id):
    patient = Patient.objects.get(patID=id)
    bill = Bill.objects.filter(patient_id=patient.id)
    serializer = BillSerializer(bill, many=True)
    return Response({"status": "success", "data": serializer.data})


@api_view(['GET'])
def clear(self):
    Doctor.objects.all().delete()
    Appointment.objects.all().delete()
    Patient.objects.all().delete()
    Agency.objects.all().delete()
    Bill.objects.all().delete()

    return Response({"status": "success"}, status.HTTP_200_OK)


def generateInsID():
    alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
                 'U', 'V',
                 'W', 'X', 'Y', 'Z']
    prefix = "EHR"
    a = random.randrange(0, 9)
    b = alphabets[random.randrange(0, 25)]
    c = random.randrange(100, 999)
    insId = f'{prefix}{a}{b}{c}'
    return str(insId)
