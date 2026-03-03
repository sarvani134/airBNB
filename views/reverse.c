#include<stdio.h>
int main(){
    int n;
scanf("%d",&n);
int ans=0;
while(n>0){
    int rem=n%10;
    ans=ans*10+rem;
    n/=10;
}
printf("reversed number: %d",n);
return 0;
}